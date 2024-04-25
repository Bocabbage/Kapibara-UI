import { SetStateAction } from "react";
import { Modal, Form, Switch, Input, Button, Select, FormInstance } from "antd";
import { ChangeEvent } from "react";
import { AnimeInfo } from "../common/Types";
import { VIDEOSERVER_URL } from "../../configs/remote";

interface AnimeDetailModalProps {
  checkAnimeModalOpen: boolean;
  isManageMode: boolean;
  modAnimeMode: boolean;
  checkAnimeLoading: boolean;
  modAnimeForm: FormInstance<any>;
  checkAnimeInfo: AnimeInfo | undefined;
  handleCheckAnimeCancel: () => void;
  handleModAnimeOk: (InputForm: FormInstance<any>) => void;
  setModAnimeMode: (value: SetStateAction<boolean>) => void;
  beforeImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({
  checkAnimeModalOpen,
  checkAnimeLoading,
  checkAnimeInfo,
  isManageMode,
  modAnimeForm,
  modAnimeMode,
  handleCheckAnimeCancel,
  handleModAnimeOk,
  setModAnimeMode,
  beforeImageUpload,
}) => {
  // Parse bitmap
  const bitmapString: string = checkAnimeInfo?.bitmap || "0";
  const bitmapArray: number[] = [];
  for (let i = bitmapString.length - 1; i >= 0; i--) {
    if (bitmapString[i] === "1") bitmapArray.push(bitmapString.length - 1 - i);
  }

  const episodes: number[] = Array.from(
    { length: 24 },
    (_, index) => index + 1,
  );
  let episodeItems = episodes.map((idx) =>
    bitmapArray.includes(idx) ? (
      <a
        key={`alink-${idx}`}
        href={`${VIDEOSERVER_URL}/mikanani/medias/${checkAnimeInfo?.uid}/${idx}.mp4`}
        target="_blank"
      >
        <div
          className="
          col-span-1 
          rounded-md 
          border-2 
          border-groovyfunk-4 
          bg-groovyfunk-4
          text-center
          text-white
        "
          key={`episode-${idx}`}
        >
          {idx}
        </div>
      </a>
    ) : (
      <div
        className="col-span-1 rounded-md border-2 text-center text-gray-200"
        key={`episode-${idx}`}
      >
        {idx}
      </div>
    ),
  );

  return (
    <>
      <Modal
        title="Anime details"
        key={checkAnimeInfo?.uid}
        open={checkAnimeModalOpen && !isManageMode}
        onOk={() => handleModAnimeOk(modAnimeForm)}
        onCancel={handleCheckAnimeCancel}
        footer={[
          <Button
            key="mod-cancel"
            className="bg-groovyfunk-3 text-white hover:bg-groovyfunk-2"
            onClick={handleCheckAnimeCancel}
          >
            Cancel
          </Button>,
          <Button
            key="mod-modify"
            className="bg-groovyfunk-1 text-white hover:bg-guavaguava-1"
            onClick={() => setModAnimeMode(!modAnimeMode)}
          >
            Modify
          </Button>,
          modAnimeMode ? (
            <Button
              loading={checkAnimeLoading}
              key="mod-submit"
              htmlType="submit"
              className="bg-groovyfunk-4 text-white hover:bg-groovyfunk-5"
              onClick={() => handleModAnimeOk(modAnimeForm)}
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
            <Select>
              <Select.Option value="latest">latest</Select.Option>
              <Select.Option value="all">all</Select.Option>
            </Select>
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
              className="block w-full text-sm text-slate-500
              file:mr-4 file:rounded-md file:border-0
              file:bg-slate-100 file:px-4
              file:py-2 file:text-sm
              file:font-semibold file:text-slate-500
              hover:file:bg-slate-100"
              onChange={beforeImageUpload}
            />
          </label>
        )}

        {!modAnimeMode && (
          <div className="my-4 mr-4 grid grid-cols-8 gap-4 rounded-md border-2 border-gray-100 p-2">
            {episodeItems}
          </div>
        )}
      </Modal>
    </>
  );
};
