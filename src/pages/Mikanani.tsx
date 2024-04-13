import { Card, Tag, Modal, Form, Switch, Input, Button } from "antd";
import {
  getAnimeList,
  getAnimeDoc,
  insertAnimeItem,
  deleteAnimeItem,
  updateAnimeItem,
  uploadAnimeImage,
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
// import { AnimeCard } from '../components/mikanani/AnimeCard';
// import React from 'react';
const { Meta } = Card;

type AnimeInfo = {
  uid: string;
  name: string;
  isActive: boolean;
  animeUrl: string;
  regex?: string;
  rule?: string;
  rssUrl?: string;
};

export default function Mikanani() {
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
  const handleAddAnimeOk = () => {
    setAddAnimeLoading(true);
    const { name, rss_url, regex, isActive, rule } =
      addAnimeForm.getFieldsValue();

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
  const handleModAnimeOk = () => {
    setCheckAnimeLoading(true);
    const { name, isActive, regex, rule, rssUrl } =
      modAnimeForm.getFieldsValue();
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
    getAnimeList(BigInt(1), BigInt(10), BigInt(1))
      .then((metas) => {
        setAnimeList(
          metas.map((meta) => {
            return {
              uid: meta.uid,
              name: meta.name,
              isActive: meta.isActive,
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
  }, []);

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
            alt="anime-image"
            className="border-transparent h-72 rounded-sm border-8 object-cover object-top"
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
                  className="hover:bg-zinc-400"
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
      <div className="bg-stone-50 flex h-full w-full flex-col">
        {/* Header */}
        <div className="basic-1/8 bg-stone-50 grid grid-cols-12">
          <div
            className="
            login-button
            basis-1/8 col-span-1 col-start-12 grid"
          >
            <Button
              key="modify"
              style={{ margin: "4px" }}
              onClick={() => setIsManageMode(!isManageMode)}
            >
              Manage
            </Button>
          </div>
        </div>
        {/* Body */}
        <div className="grid grid-cols-4 grid-rows-4">{cardItems}</div>
      </div>

      {/* Add new anime modal */}
      <Modal
        title="Add new anime"
        open={addAnimeModalOpen}
        onOk={handleAddAnimeOk}
        onCancel={handleAddAnimeCancel}
        footer={[
          <Button key="add-cancel" onClick={handleAddAnimeCancel}>
            Cancel
          </Button>,
          <Button
            loading={addAnimeLoading}
            key="add-submit"
            htmlType="submit"
            onClick={handleAddAnimeOk}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={addAnimeForm}
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item required label="name" name="name">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item required label="rule" name="rule">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item required label="regex" name="regex">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item required label="rss-url" name="rss_url">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item
            label="active"
            name="isActive"
            initialValue={true}
            valuePropName="checked"
          >
            <Switch defaultChecked className="bg-stone-200" />
          </Form.Item>
        </Form>

        <label className="block">
          <input
            type="file"
            className="text-slate-500 file:bg-slate-100 file:text-slate-500 hover:file:bg-slate-100
            block w-full text-sm
            file:mr-4 file:rounded-md
            file:border-0 file:px-4
            file:py-2 file:text-sm
            file:font-semibold"
            onChange={beforeImageUpload}
          />
        </label>
      </Modal>

      {/* Delete anime modal */}
      <Modal
        title="Delete anime"
        open={delAnimeModalOpen}
        footer={[
          <Button key="del-cancel" onClick={handleDelAnimeCancel}>
            No
          </Button>,
          <Button
            loading={delAnimeLoading}
            key="del-submit"
            htmlType="submit"
            onClick={handleDelAnimeOk}
          >
            Yes
          </Button>,
        ]}
      >
        You sure to delete the anime item(s) ?
      </Modal>

      {/* Anime doc-check + Modify */}
      <Modal
        title="Anime details"
        key={checkAnimeInfo?.uid}
        open={checkAnimeModalOpen && !isManageMode}
        onOk={handleModAnimeOk}
        onCancel={handleCheckAnimeCancel}
        footer={[
          <Button key="mod-cancel" onClick={handleCheckAnimeCancel}>
            Cancel
          </Button>,
          <Button
            key="mod-modify"
            onClick={() => setModAnimeMode(!modAnimeMode)}
          >
            Modify
          </Button>,
          modAnimeMode ? (
            <Button
              loading={checkAnimeLoading}
              key="mod-submit"
              htmlType="submit"
              onClick={handleModAnimeOk}
            >
              Submit
            </Button>
          ) : null,
        ]}
      >
        <Form
          form={modAnimeForm}
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          disabled={!modAnimeMode}
        >
          <Form.Item required label="name" name="name">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item required label="rule" name="rule">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item required label="regex" name="regex">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item required label="rss-url" name="rssUrl">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item label="active" name="isActive" valuePropName="checked">
            <Switch
              disabled={!modAnimeMode}
              defaultChecked={checkAnimeInfo?.isActive}
              className="bg-stone-200"
            />
          </Form.Item>
        </Form>
        {modAnimeMode && (
          <label className="block">
            <input
              type="file"
              className="text-slate-500 file:bg-slate-100 file:text-slate-500 hover:file:bg-slate-100
              block w-full text-sm
              file:mr-4 file:rounded-md
              file:border-0 file:px-4
              file:py-2 file:text-sm
              file:font-semibold"
              onChange={beforeImageUpload}
            />
          </label>
        )}
      </Modal>
    </>
  );
}
