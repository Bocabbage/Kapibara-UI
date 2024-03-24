import axios from 'axios'
import { APISERVER_URL } from '../configs/remote'

type Meta = {
    uid: string,
    name: string,
    isActive: boolean
}

type GetAnimeListResponse = {
    count: number,
    metas: Array<Meta>,
}

const getAnimeList = async (start: number, end: number, status_filter: number) => {
    const { data } = await axios.get<GetAnimeListResponse>(
        `${APISERVER_URL}/mikanani/v2/anime/list-meta?start=${start}&status_filter=${status_filter}&end=${end}`, 
        {
            withCredentials: true,
        }
    )
    // for debug
    // console.log(data.metas)
    return data.metas
}

const InsertAnimeItem = async (name: string, rss_url: string, rule: string, regex: string, isActive: boolean) => {
    const { status } = await axios.post(
        `${APISERVER_URL}/mikanani/v2/anime/insert`,
        {
            name: name,
            rss_url: rss_url,
            rule: rule,
            regex: regex,
            is_active: isActive? 1: -1
        },
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    // for debug
    // console.log(data.metas)
    return status
}

export {  
    getAnimeList,
    InsertAnimeItem
}