import { Card, Tag, Form, Pagination, FormInstance } from "antd";
import {
  getAnimeList,
  getAnimeDoc,
  insertAnimeItem,
  deleteAnimeItem,
  updateAnimeItem,
  uploadAnimeImage,
  getAnimeCount,
} from "../apis/remote";
import { useAppDispatch } from "../app/hooks";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { logout } from "../features/auth/authSlice";
import { APISERVER_URL } from "../configs/remote";
import {
  CheckCircleOutlined,
  MinusCircleOutlined,
  FileAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { KButton } from "../components/common/Button";
import { AnimeInfo } from "../components/common/Types";
import { AddAnimeModal } from "../components/mikanani/AddAnimeModal";
import { AnimeDetailModal } from "../components/mikanani/AnimeDetailModal";
import { DelAnimeModal } from "../components/mikanani/DelAnimeModal";
const { Meta } = Card;

export default function Mikanani() {
  {
    /* ----------------- states ----------------- */
  }
  const [pageNum, setPageNum] = useState(1);
  const [animeCount, setAnimeCount] = useState(0);
  const [animeList, setAnimeList] = useState(Array<AnimeInfo>);

  // Modal-open state
  const [addAnimeModalOpen, setAddAnimeModalOpen] = useState(false);
  const [delAnimeModalOpen, setDelAnimeModalOpen] = useState(false);
  const [checkAnimeModalOpen, setCheckAnimeModalOpen] = useState(false);

  // Request loading state
  const [addAnimeLoading, setAddAnimeLoading] = useState(false);
  const [delAnimeLoading, setDelAnimeLoading] = useState(false);
  const [checkAnimeLoading, setCheckAnimeLoading] = useState(false);

  // Delete mode state
  const [isManageMode, setIsManageMode] = useState(false);
  const toDeleteIds = useRef<string[]>([]);

  // Modify doc state
  const [modAnimeMode, setModAnimeMode] = useState(false);
  const [checkAnimeInfo, setCheckAnimeInfo] = useState<AnimeInfo>();

  // post-form
  const [addAnimeForm] = Form.useForm();
  const [modAnimeForm] = Form.useForm();
  const [imageFile, setImageFile] = useState<File>();
  const dispatch = useAppDispatch();

  {
    /* ----------------- handlers ----------------- */
  }
  const showAddAnimeModal = () => setAddAnimeModalOpen(true);
  const showDelAnimeModal = () => setDelAnimeModalOpen(true);
  const showCheckAnimeModal = () => setCheckAnimeModalOpen(true);

  const beforeImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    const isPng = file ? file.type === "image/png" : false;
    const isOversize = file ? file.size / 1024 / 1024 > 4 : false;
    if (file && isPng && !isOversize) {
      setImageFile(file);
    }
    if (!isPng) {
      alert("Only png file.");
    } else if (isOversize) {
      alert(`the pic size should less than 4MB.`);
    }
  };

  const handleAddAnimeCancel = () => {
    setAddAnimeModalOpen(false);
  };

  const handleAddAnimeOk = (InputForm: FormInstance<any>) => {
    setAddAnimeLoading(true);
    const { name, rss_url, regex, isActive, rule } = InputForm.getFieldsValue();

    insertAnimeItem(name, rss_url, rule, regex, isActive)
      .then(({ data }) => {
        if (imageFile !== undefined) {
          let uid = data.uid;
          uploadAnimeImage(uid, imageFile)
            .then(() => {
              alert("Add anime success!");
              setImageFile(undefined);
              window.location.reload();
            })
            .catch((error) => {
              switch (error.response.status) {
                case 401:
                  alert("login expired, please sign in again!");
                  dispatch(logout());
                  break;
                default:
                  console.log(error.response);
                  alert("Upload image failed.");
                  setImageFile(undefined);
              }
            });
        }

        alert("Add anime success!");
        setImageFile(undefined);
        window.location.reload();
      })
      .catch((error) => {
        switch (error.response.status) {
          case 401:
            alert("login expired, please sign in again!");
            dispatch(logout());
            break;
        }
      });
    setImageFile(undefined);
    setAddAnimeLoading(false);
    setAddAnimeModalOpen(false);
  };

  const handleDelAnimeCancel = () => {
    toDeleteIds.current.pop();
    setDelAnimeModalOpen(false);
  };

  const handleDelAnimeOk = () => {
    setDelAnimeLoading(true);
    for (const toDelId of toDeleteIds.current) {
      deleteAnimeItem(toDelId)
        .then(() => {
          alert("Delete anime success!");
          window.location.reload();
        })
        .catch((error) => {
          switch (error.response.status) {
            case 401:
              alert("login expired, please sign in again!");
              dispatch(logout());
              break;
          }
        });
    }
    toDeleteIds.current.splice(0, toDeleteIds.current.length); // empty the array
    setDelAnimeLoading(false);
    setDelAnimeModalOpen(false);
  };

  const handleCheckAnimeCancel = () => {
    setModAnimeMode(false);
    setCheckAnimeModalOpen(false);
  };

  const handleModAnimeOk = (InputForm: FormInstance<any>) => {
    setCheckAnimeLoading(true);
    const { name, isActive, regex, rule, rssUrl } = InputForm.getFieldsValue();
    const uid = checkAnimeInfo?.uid ?? "0";
    updateAnimeItem(uid, name, isActive, regex, rssUrl, rule)
      .then(() => {
        alert(`Update anime: ${name} config success!`);
        window.location.reload();
      })
      .catch((error) => {
        switch (error.response.status) {
          case 401:
            alert("login expired, please sign in again!");
            dispatch(logout());
            break;
        }
      });

    if (imageFile !== undefined) {
      uploadAnimeImage(uid, imageFile)
        .then(() => {
          setImageFile(undefined);
          window.location.reload();
        })
        .catch((error) => {
          setImageFile(undefined);
          switch (error.response.status) {
            case 401:
              alert("login expired, please sign in again!");
              dispatch(logout());
              break;
            default:
              console.log(error.response);
              alert("Upload image failed.");
          }
        });
    }

    setCheckAnimeLoading(false);
    setCheckAnimeModalOpen(false);
  };

  useEffect(() => {
    getAnimeCount()
      .then((count) => setAnimeCount(count))
      .catch((error) => {
        switch (error.response.status) {
          case 401:
            alert("login expired, please sign in again!");
            dispatch(logout());
            break;
        }
      });

    let start = BigInt((pageNum - 1) * 10 + 1);
    getAnimeList(start, start + BigInt(10), BigInt(1))
      .then((metas) => {
        setAnimeList(
          metas.map((meta) => {
            return {
              uid: meta.uid,
              name: meta.name,
              isActive: meta.isActive,
              bitmap: meta.bitmap,
              animeUrl: `${APISERVER_URL}/mikanani/v2/anime/pics/${meta.uid}`, // "/placeholder-anime.png"
            };
          }),
        );
      })
      .catch((error) => {
        switch (error.response.status) {
          case 401:
            alert("login expired, please sign in again!");
            dispatch(logout());
            break;
        }
      });
  }, [pageNum]);

  animeList.sort((a, b) => {
    if (a.isActive == b.isActive) {
      return 0;
    }
    return a.isActive ? -1 : 1;
  });

  let cardItems = animeList.map((anime) => (
    <div key={anime.name} className="col-span-1 row-span-1 grid h-full w-full">
      <Card
        key={`${anime.name}-card`}
        style={{ margin: "6px" }}
        unique-id={anime.uid}
        cover={
          <img
            className="h-72 border-transparent object-cover object-top"
            src={anime.animeUrl}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "/placeholder-anime.png";
            }}
          />
        }
        extra={
          // TODO: add delete logic
          isManageMode
            ? [
                <DeleteOutlined
                  key={`${anime.name}-delbutton`}
                  unique-id={anime.uid}
                  className="rounded-sm hover:bg-slate-100 hover:text-groovyfunk-4"
                  onClick={(event) => {
                    const toDelId = String(
                      event.currentTarget.getAttribute("unique-id"),
                    );
                    toDeleteIds.current.push(toDelId);
                    showDelAnimeModal();
                  }}
                />,
              ]
            : []
        }
        onClick={() => {
          if (isManageMode) {
            return;
          }

          let currAnimeInfo: AnimeInfo = {
            uid: anime.uid,
            name: anime.name,
            bitmap: anime.bitmap,
            isActive: anime.isActive,
            animeUrl: anime.animeUrl,
          };
          // console.log(`currAnimeInfo: ${currAnimeInfo.name}`)
          getAnimeDoc(anime.uid)
            .then((doc) => {
              (currAnimeInfo.regex = doc.regex),
                (currAnimeInfo.rule = doc.rule),
                (currAnimeInfo.rssUrl = doc.rssUrl);
              setCheckAnimeInfo(currAnimeInfo);
              modAnimeForm.setFieldsValue(currAnimeInfo);
              showCheckAnimeModal();
            })
            .catch((error) => {
              switch (error.response.status) {
                case 401:
                  alert("login expired, please sign in again!");
                  dispatch(logout());
                  break;
              }
            });
        }}
        hoverable
      >
        <Meta
          title={anime.name}
          description={
            anime.isActive ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                active
              </Tag>
            ) : (
              <Tag icon={<MinusCircleOutlined />} color="default">
                inactive
              </Tag>
            )
          }
        />
      </Card>
    </div>
  ));
  cardItems = [
    ...cardItems,
    <div
      key={`addnewanime`}
      className="col-span-1 row-span-1 grid"
      onClick={showAddAnimeModal}
    >
      <Card
        key={"addnewanime-card"}
        style={{ margin: "6px" }}
        hoverable
        cover={
          <FileAddOutlined
            style={{ fontSize: "144px", color: "#52525b", paddingTop: "96px" }}
          />
        }
      >
        <Meta title="Add new anime" />
      </Card>
    </div>,
  ];

  return (
    <>
      {/* ----------------- Page ----------------- */}
      <div className="flex h-full w-full flex-col bg-stone-50">
        {/* Header */}
        <div className="basic-1/8 m-2 flex">
          <div className="col-span-4 col-start-1 flex justify-start">
            <Pagination
              current={Number(pageNum)}
              total={animeCount}
              onChange={(page) => {
                setPageNum(page);
              }}
            />
          </div>

          <div
            className="
            login-button col-span-1
            mr-2 grid"
          >
            <KButton
              key="modify"
              text="Manage"
              onClick={() => setIsManageMode(!isManageMode)}
            />
          </div>
        </div>
        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
          {cardItems}
        </div>
      </div>

      {/* ----------------- Modals ----------------- */}
      {/* Add new anime modal */}
      <AddAnimeModal
        addAnimeModalOpen={addAnimeModalOpen}
        addAnimeLoading={addAnimeLoading}
        addAnimeForm={addAnimeForm}
        handleAddAnimeOk={handleAddAnimeOk}
        handleAddAnimeCancel={handleAddAnimeCancel}
        beforeImageUpload={beforeImageUpload}
      />

      {/* Delete anime modal */}
      <DelAnimeModal
        delAnimeModalOpen={delAnimeModalOpen}
        delAnimeLoading={delAnimeLoading}
        handleDelAnimeCancel={handleDelAnimeCancel}
        handleDelAnimeOk={handleDelAnimeOk}
      />

      {/* Anime doc-check + Modify */}
      <AnimeDetailModal
        checkAnimeModalOpen={checkAnimeModalOpen}
        isManageMode={isManageMode}
        modAnimeMode={modAnimeMode}
        checkAnimeLoading={checkAnimeLoading}
        modAnimeForm={modAnimeForm}
        checkAnimeInfo={checkAnimeInfo}
        handleCheckAnimeCancel={handleCheckAnimeCancel}
        handleModAnimeOk={handleModAnimeOk}
        setModAnimeMode={setModAnimeMode}
        beforeImageUpload={beforeImageUpload}
      />
    </>
  );
}
