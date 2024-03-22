import { Layout, Menu, Tag, ConfigProvider } from 'antd'
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import React from 'react';

const MenuName: string[] = ["AnimeList"]
const MenuItem = new Array(1).fill(null).map((_, index) => ({
  key: index + 1,
  label: `${MenuName[index]}`
}))

type AnimeInfo = {
  name: string,
  isActive: boolean,
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


export default function Mikanani() {
    // TODO: [Enhancement] All config together
    animeList.sort((a, b) => {
        if(a.isActive == b.isActive){ return 0; }
        return a.isActive ? -1: 1;
    })

    return <>

    </>
}