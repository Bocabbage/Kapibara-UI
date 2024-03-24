import { Card, Tag, Modal, Form, Switch, Input, Button } from 'antd'
import { getAnimeList, InsertAnimeItem } from '../apis/remote';
import { useAppDispatch } from '../app/hooks';
import { useEffect, useState } from 'react';
import { logout } from "../features/auth/authSlice"
import { CheckCircleOutlined, MinusCircleOutlined, FileAddOutlined } from '@ant-design/icons'
// import { AnimeCard } from '../components/mikanani/AnimeCard';
// import React from 'react';
const { Meta } = Card;

type AnimeInfo = {
  name: string,
  isActive: boolean,
  animeUrl: string,
}


export default function Mikanani() {
    const [animeList, setAnimeList] = useState(Array<AnimeInfo>)
    const [addAnimeModalOpen, setAddAnimeModalOpen] = useState(false)
    const [addAnimeLoading, setAddAnimeLoading] = useState(false)
    const [addAnimeForm] = Form.useForm()
    const dispatch = useAppDispatch()

    const showAddAnimeModal = () => setAddAnimeModalOpen(true)
    const handleAddAnimeCancel = () => setAddAnimeModalOpen(false)
    const handleAddAnimeOk = () => {
      setAddAnimeLoading(true)
      const {name, rss_url, regex, isActive, rule} = addAnimeForm.getFieldsValue()
      InsertAnimeItem(name, rss_url, rule, regex, isActive)
      .then(() => {
        alert("Add anime success!")
      })
      .catch(error => {
        switch(error.response.status) {
          case 401: alert("login expired, please sign in again!"); dispatch(logout()); break;
        }
      })
      setAddAnimeLoading(false)
      setAddAnimeModalOpen(false)
    }

    useEffect(() => {
      getAnimeList(1, 10, 1)
      .then(metas => {
        setAnimeList(metas.map(meta => {
          return {
            name: meta.name,
            isActive: meta.isActive,
            animeUrl: "https://storage.googleapis.com/www-cw-com-tw/article/202311/article-6544869e92e50.jpg"
          }
        }))
      })
      .catch(error => {
        switch(error.response.status) {
          case 401: alert("login expired, please sign in again!"); dispatch(logout()); break;
        }
      })
    }, [])

    // TODO: [Enhancement] All config together
    animeList.sort((a, b) => {
        if(a.isActive == b.isActive){ return 0; }
        return a.isActive ? -1: 1;
    })

    let cardItems = animeList.map(anime => 
      <div key={anime.name} className="grid col-span-1 row-span-1 h-full w-full">
      <Card 
        style={{ margin: "6px" }}
        cover={
          <img
            alt="example"
            className="h-72 w-72 blur-sm hover:blur-none"
            src={anime.animeUrl}
          />
        }
        hoverable
      >
        <Meta
          title={anime.name}
          description={
            anime.isActive? 
              <Tag icon={<CheckCircleOutlined />} color="success" >active</Tag>:
              <Tag icon={<MinusCircleOutlined  />} color="default">inactive</Tag>
          }
        />
      </Card>
      </div>
    )
    cardItems = [
      ...cardItems,
      <div key={"AddNewAnime"} className="grid col-span-1 row-span-1" onClick={showAddAnimeModal}>
        <Card style={{ margin: "6px" }} hoverable
          cover={<FileAddOutlined style={{ fontSize: "144px", color: "#52525b", paddingTop: "96px"}}/>}
        >
          <Meta
            title="Add new anime"
          />
        </Card>
      </div>
    ]

    return <>
      <div className="grid grid-rows-4 grid-cols-4">
        {cardItems}
      </div>
      <Modal 
        title="Add new anime"
        open={addAnimeModalOpen}
        onOk={handleAddAnimeOk}
        onCancel={handleAddAnimeCancel}
        footer={[
          <Button key="cancel" onClick={handleAddAnimeCancel}>Cancel</Button>,
          <Button loading={addAnimeLoading} key="submit" htmlType="submit" onClick={handleAddAnimeOk}>Submit</Button>
        ]}
      >
        <Form
          form={addAnimeForm}
          labelAlign="left"
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
        >
          <Form.Item required label="name" name="name">
            <Input />
          </Form.Item>
          <Form.Item required label="rule" name="rule">
            <Input />
          </Form.Item>
          <Form.Item required label="regex" name="regex">
            <Input />
          </Form.Item>
          <Form.Item required label="rss-url" name="rss_url">
            <Input />
          </Form.Item>
          <Form.Item label="active" name="isActive" initialValue={true} valuePropName="checked">
            <Switch defaultChecked className="bg-stone-200" />
          </Form.Item>
        </Form>
      </Modal>
    </>
}