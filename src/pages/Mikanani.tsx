import { Layout, Menu, Tag, ConfigProvider } from 'antd'
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import React from 'react';

const { Header, Content, Footer } = Layout
const MenuName: string[] = ["AnimeList"]
const MenuItem = new Array(1).fill(null).map((_, index) => ({
  key: index + 1,
  label: `${MenuName[index]}`
}))

type AnimeInfo = {
  name: string,
  isActive: boolean,
}

type AnimeRowProps = {
  animeInfo: AnimeInfo
}

type AnimeRowListProps = {
  animeInfoList: Array<AnimeInfo>
}

// TODO: Get data from API. Current local mock data
const animeList: Array<AnimeInfo> = [
  {
    name: "AnimeName1",
    isActive: true,
  },
  {
    name: "AnimeName2",
    isActive: false,
  },
  {
    name: "AnimeName3",
    isActive: true,
  },
]

const AnimeRow: React.FC<AnimeRowProps> = ({ animeInfo }) => {
  return (
    <div className='grid grid-cols-4 gap-4 row-span-full font-oswald-regular mx-4 my-3 p-4 min-h-8 text-base outline outline-3 outline-orange-400 rounded-lg hover:bg-emerald-300'>
      <div className='col-span-2 text-left'>{animeInfo.name}</div>
      <div className='col-span-1 col-end-5 text-right'>    
          { animeInfo.isActive ? <Tag icon={<CheckCircleOutlined />} bordered={false} color='success' >active</Tag> : <Tag icon={<MinusCircleOutlined />} bordered={false} >closed</Tag> }
      </div>
    </div>
  )
}

const AnimeTable: React.FC<AnimeRowListProps> = ({ animeInfoList }) => {
  return (
    <div className='flex flex-col w-full h-full min-h-full min-w-full'>
      {animeInfoList.map((item: AnimeInfo) => 
        <AnimeRow key={item.name} animeInfo={item}></AnimeRow>
      )}
    </div>
  )
}


export default function Mikanani() {
    // TODO: [Enhancement] All config together
    animeList.sort((a, b) => {
        if(a.isActive == b.isActive){ return 0; }
        return a.isActive ? -1: 1;
    })

    return <>
      <ConfigProvider
        theme={{
          token: {
            // fontFamily: 'Oswald-Bold',
          },
          components: {
            Layout: {
              bodyBg: '#f0fdf4',
              headerBg: '#d1fae5',
              footerBg: '#d1fae5',
            },
            Menu: {
              itemBg: '#d1fae5',
              horizontalItemSelectedColor: '#065f46',
              fontFamily: 'Oswald-Bold',
            },
          },
        }}
      >
        <title>Mikanani</title>
        <div className="h-full w-full min-h-full rounded-lg">
        <Layout style={{ height: '100%', width: '100%' }}>
          <Header>
            <Menu mode="horizontal" items={MenuItem}/>
          </Header>
          <Content style={{ width: '100%', minWidth: '90%', height: '90%', minHeight: '60%', padding: '15px' }}>
            <div className="h-full min-h-full bg-emerald-100 rounded-lg flex flex-col">
              <AnimeTable animeInfoList={animeList} />
            </div>
          </Content>
          <Footer style={{ width: '100%', height: '5%', minHeight: '5%' }}>Bocabbage</Footer>
        </Layout>
        </div>
      </ConfigProvider>
    </>
}