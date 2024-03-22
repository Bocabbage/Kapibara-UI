import { Card, Col, Row, ConfigProvider } from 'antd'
// import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
// import { AnimeCard } from '../components/mikanani/AnimeCard';
// import React from 'react';
const { Meta } = Card;

type AnimeInfo = {
  name: string,
  isActive: boolean,
  animeUrl: string,
}


// TODO: Get data from API. Current local mock data
const animeList: Array<AnimeInfo> = [
  {
    name: "AnimeName1",
    isActive: true,
    animeUrl: "/kapibara-maru.png"
  },
  {
    name: "AnimeName2",
    animeUrl: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    isActive: false,
  },
  {
    name: "AnimeName3",
    animeUrl: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    isActive: true,
  },
  {
    name: "AnimeName4",
    animeUrl: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    isActive: true,
  },
]


export default function Mikanani() {
    // TODO: [Enhancement] All config together
    animeList.sort((a, b) => {
        if(a.isActive == b.isActive){ return 0; }
        return a.isActive ? -1: 1;
    })

    const cardItems = animeList.map(anime => 
      <Col span={6} key={anime.name}>
      <Card 
        style={{ margin: "6px", maxHeight: "" }}
        cover={
          <img
            alt="example"
            className="w-max h-max"
            src={anime.animeUrl}
          />
        }
        hoverable
      >
        <Meta
          title={anime.name}
          description={"is-active: " + anime.isActive}
        />
      </Card>
      </Col>
    )

    return <>
      <Row gutter={24}>
        {cardItems}
      </Row>
    </>
}