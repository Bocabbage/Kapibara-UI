import { Modal, Form, Switch, Input, Button, Select, FormInstance } from "antd";
import { ChangeEvent } from "react";

interface AddAnimeModalProps {
  addAnimeModalOpen: boolean;
  addAnimeLoading: boolean;
  addAnimeForm: FormInstance<any>;
  handleAddAnimeOk: (InputForm: FormInstance<any>) => void;
  handleAddAnimeCancel: () => void;
  beforeImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const AddAnimeModal: React.FC<AddAnimeModalProps> = ({
  addAnimeModalOpen,
  addAnimeLoading,
  addAnimeForm,
  handleAddAnimeOk,
  handleAddAnimeCancel,
  beforeImageUpload,
}) => {
  return (
    <>
      <Modal
        title="Add new anime"
        open={addAnimeModalOpen}
        onOk={() => handleAddAnimeOk(addAnimeForm)}
        onCancel={handleAddAnimeCancel}
        footer={[
          <Button
            key="add-cancel"
            className="bg-groovyfunk-3 text-white hover:bg-groovyfunk-2"
            onClick={handleAddAnimeCancel}
          >
            Cancel
          </Button>,
          <Button
            loading={addAnimeLoading}
            key="add-submit"
            htmlType="submit"
            type="default"
            className="bg-groovyfunk-4 text-white hover:bg-groovyfunk-5"
            onClick={() => handleAddAnimeOk(addAnimeForm)}
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
            <Select>
              <Select.Option value="latest">latest</Select.Option>
              <Select.Option value="all">all</Select.Option>
            </Select>
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
            className="block w-full text-sm text-slate-500
            file:mr-4 file:rounded-md file:border-0
            file:bg-slate-100 file:px-4
            file:py-2 file:text-sm
            file:font-semibold file:text-slate-500
            hover:file:bg-slate-100"
            onChange={beforeImageUpload}
          />
        </label>
      </Modal>
    </>
  );
};
