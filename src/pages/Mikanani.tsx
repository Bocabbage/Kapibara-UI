import { Card, Tag, Modal, Form, Switch, Input, Button } from 'antd'
import { getAnimeList, getAnimeDoc, insertAnimeItem, deleteAnimeItem, updateAnimeItem } from '../apis/remote';
import { useAppDispatch } from '../app/hooks';
import { useEffect, useState, useRef } from 'react';
import { logout } from "../features/auth/authSlice"
import { CheckCircleOutlined, MinusCircleOutlined, FileAddOutlined, DeleteOutlined } from '@ant-design/icons'
// import { AnimeCard } from '../components/mikanani/AnimeCard';
// import React from 'react';
const { Meta } = Card;

type AnimeInfo = {
  uid: bigint,
  name: string,
  isActive: boolean,
  animeUrl: string,
  regex?: string,
  rule?: string,
  rssUrl?: string,
}


export default function Mikanani() {
    const [animeList, setAnimeList] = useState(Array<AnimeInfo>)

    // Modal-open state
    const [addAnimeModalOpen, setAddAnimeModalOpen] = useState(false)
    const [delAnimeModalOpen, setDelAnimeModalOpen] = useState(false)
    const [checkAnimeModalOpen, setCheckAnimeModalOpen] = useState(false)

    // Request loading state
    const [addAnimeLoading, setAddAnimeLoading] = useState(false)
    const [delAnimeLoading, setDelAnimeLoading] = useState(false)
    const [checkAnimeLoading, setCheckAnimeLoading] = useState(false)

    // Delete mode state
    const [isManageMode, setIsManageMode] = useState(false)
    const toDeleteIds = useRef<string[]>([])

    // Modify doc state
    const [modAnimeMode, setModAnimeMode] = useState(false)
    const [checkAnimeInfo, setCheckAnimeInfo] = useState<AnimeInfo>()

    // post-form
    const [addAnimeForm] = Form.useForm()
    const [modAnimeForm] = Form.useForm()
    const dispatch = useAppDispatch()

    const showAddAnimeModal = () => setAddAnimeModalOpen(true)
    const showDelAnimeModal = () => setDelAnimeModalOpen(true)
    const showCheckAnimeModal = () => setCheckAnimeModalOpen(true)
    
    const handleAddAnimeCancel = () => setAddAnimeModalOpen(false)
    const handleAddAnimeOk = () => {
      setAddAnimeLoading(true)
      const {name, rss_url, regex, isActive, rule} = addAnimeForm.getFieldsValue()
      try {
        const formatRegex = new RegExp(regex)
      } catch (error) {
        alert("Add failed: Invalid regex!")
        window.location.reload()
      }

      insertAnimeItem(name, rss_url, rule, regex, isActive)
      .then(() => {
        alert("Add anime success!")
        window.location.reload()
      })
      .catch(error => {
        switch(error.response.status) {
          case 401: alert("login expired, please sign in again!"); dispatch(logout()); break;
        }
      })
      setAddAnimeLoading(false)
      setAddAnimeModalOpen(false)
    }

    const handleDelAnimeCancel = () => {
      toDeleteIds.current.pop()
      setDelAnimeModalOpen(false)
    }

    const handleDelAnimeOk = () => {
      setDelAnimeLoading(true)
      for(const toDelId of toDeleteIds.current) {
        deleteAnimeItem(toDelId)
        .then(() => {
          alert("Delete anime success!")
          window.location.reload()
        })
        .catch(error => {
          switch(error.response.status) {
            case 401: alert("login expired, please sign in again!"); dispatch(logout()); break;
          }
        })
      }
      toDeleteIds.current.splice(0, toDeleteIds.current.length) // empty the array
      setDelAnimeLoading(false)
      setDelAnimeModalOpen(false)
    }

    const handleCheckAnimeCancel = () => {
      setModAnimeMode(false)
      setCheckAnimeModalOpen(false)
    }
    const handleModAnimeOk = () => {
      setCheckAnimeLoading(true)
      const {name, isActive, regex, rule, rssUrl} = modAnimeForm.getFieldsValue()
      const uid = checkAnimeInfo?.uid ?? BigInt(0)
      updateAnimeItem(uid, name, isActive, regex, rssUrl, rule)
      .then(() => {
        alert(`Update anime: ${name} config success!`)
        window.location.reload()
      })
      .catch(error => {
        switch(error.response.status) {
          case 401: alert("login expired, please sign in again!"); dispatch(logout()); break;
        }
      })
      setCheckAnimeLoading(false)
      setCheckAnimeModalOpen(false)
    }

    useEffect(() => {
      getAnimeList(BigInt(1), BigInt(10), BigInt(1))
      .then(metas => {
        setAnimeList(metas.map(meta => {
          return {
            uid: BigInt(meta.uid),
            name: meta.name,
            isActive: meta.isActive,
            animeUrl: "/placeholder-anime.png"
          }
        }))
      })
      .catch(error => {
        switch(error.response.status) {
          case 401: alert("login expired, please sign in again!"); dispatch(logout()); break;
        }
      })
    }, [])


    animeList.sort((a, b) => {
        if(a.isActive == b.isActive){ return 0; }
        return a.isActive ? -1: 1;
    })

    let cardItems = animeList.map(anime => 
      <div key={anime.name} className="grid col-span-1 row-span-1 h-full w-full">
      <Card
        key={`${anime.name}-card`}
        style={{ margin: "6px" }}
        unique-id={anime.uid}
        cover={
          <img
            alt="example"
            className="h-72 w-72"
            src={anime.animeUrl}
          />
        }
        extra={
          // TODO: add delete logic
          isManageMode? [<DeleteOutlined key={`${anime.name}-delbutton`} unique-id={anime.uid} className="hover:bg-zinc-400" onClick={(event) => {
            const toDelId = String(event.currentTarget.getAttribute("unique-id"))
            toDeleteIds.current.push(toDelId)
            showDelAnimeModal()
          }}/>] : []
        }
        onClick={ () => {
          let currAnimeInfo: AnimeInfo = {
            uid: anime.uid,
            name: anime.name,
            isActive: anime.isActive,
            animeUrl: anime.animeUrl,
          }
          // console.log(`currAnimeInfo: ${currAnimeInfo.name}`)
          getAnimeDoc(anime.uid)
          .then(doc => {
            currAnimeInfo.regex = doc.regex,
            currAnimeInfo.rule = doc.rule,
            currAnimeInfo.rssUrl = doc.rssUrl
            setCheckAnimeInfo(currAnimeInfo)
            modAnimeForm.setFieldsValue(currAnimeInfo)
            showCheckAnimeModal()
          })
          .catch(error => {
            switch(error.response.status) {
              case 401: alert("login expired, please sign in again!"); dispatch(logout()); break;
            }
          })
        }}
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
      <div key={`addnewanime`} className="grid col-span-1 row-span-1" onClick={showAddAnimeModal}>
        <Card key={"addnewanime-card"} style={{ margin: "6px" }} hoverable
          cover={<FileAddOutlined style={{ fontSize: "144px", color: "#52525b", paddingTop: "96px"}}/>}
        >
          <Meta
            title="Add new anime"
          />
        </Card>
      </div>
    ]

    return <>
      <div className="w-full h-full flex flex-col bg-stone-50">
        {/* Header */}
        <div className="basic-1/8 grid grid-cols-12 bg-stone-50">
          <div className="
            login-button
            grid col-span-1 col-start-12 basis-1/8" 
          >
            <Button key="modify" style={{margin: "4px"}} onClick={() => setIsManageMode(!isManageMode)}>Manage</Button>
          </div>
        </div>
        {/* Body */}
        <div className="grid grid-rows-4 grid-cols-4">
          {cardItems}
        </div>
      </div>

      {/* Add new anime modal */}
      <Modal 
        title="Add new anime"
        open={addAnimeModalOpen}
        onOk={handleAddAnimeOk}
        onCancel={handleAddAnimeCancel}
        footer={[
          <Button key="add-cancel" onClick={handleAddAnimeCancel}>Cancel</Button>,
          <Button loading={addAnimeLoading} key="add-submit" htmlType="submit" onClick={handleAddAnimeOk}>Submit</Button>
        ]}
      >
        <Form
          form={addAnimeForm}
          labelAlign="left"
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
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
          <Form.Item label="active" name="isActive" initialValue={true} valuePropName="checked">
            <Switch defaultChecked className="bg-stone-200" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete anime modal */}
      <Modal
        title="Delete anime"
        open={delAnimeModalOpen}
        footer={[
          <Button key="del-cancel" onClick={handleDelAnimeCancel}>No</Button>,
          <Button loading={delAnimeLoading} key="del-submit" htmlType="submit" onClick={handleDelAnimeOk}>Yes</Button>
        ]}
      >
        You sure to delete the anime item(s) ?
      </Modal>

      {/* Anime doc-check + Modify */}
      <Modal
        title="Anime details"
        key={checkAnimeInfo?.uid}
        open={checkAnimeModalOpen}
        onOk={handleModAnimeOk}
        onCancel={handleCheckAnimeCancel}
        footer={[
          <Button key="mod-cancel" onClick={handleCheckAnimeCancel}>Cancel</Button>,
          <Button key="mod-modify" onClick={() => setModAnimeMode(!modAnimeMode)}>Modify</Button>,
          modAnimeMode ? <Button loading={checkAnimeLoading} key="mod-submit" htmlType="submit" onClick={handleModAnimeOk}>Submit</Button> : null,
        ]}
      >
        <Form
          form={modAnimeForm}
          labelAlign="left"
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
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
            <Switch disabled={!modAnimeMode} defaultChecked={checkAnimeInfo?.isActive}  className="bg-stone-200" />
          </Form.Item>
        </Form>
      </Modal>
    </>
}