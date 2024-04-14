import { Modal, Button } from "antd";

interface DelAnimeModalProps {
  delAnimeModalOpen: boolean;
  delAnimeLoading: boolean;
  handleDelAnimeCancel: () => void;
  handleDelAnimeOk: () => void;
}

export const DelAnimeModal: React.FC<DelAnimeModalProps> = ({
  delAnimeModalOpen,
  delAnimeLoading,
  handleDelAnimeCancel,
  handleDelAnimeOk,
}) => {
  return (
    <>
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
    </>
  );
};
