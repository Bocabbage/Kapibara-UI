import axios from 'axios'
import { APISERVER_URL } from '../configs/remote'

type Meta = {
    uid: string,
    name: string,
    isActive: boolean
}

type GetAnimeListResponse = {
    count: bigint,
    metas: Array<Meta>,
}

type AnimeDoc = {
    uid: string,
    rssUrl: string,
    rule: string,
    regex: string,
}

type GetAnimeDocResponse = {
    doc: AnimeDoc
}

const getAnimeList = async (start: bigint, end: bigint, status_filter: bigint) => {
    const { data } = await axios.get<GetAnimeListResponse>(
        `${APISERVER_URL}/mikanani/v2/anime/list-meta?start=${start}&status_filter=${status_filter}&end=${end}`, 
        {
            withCredentials: true,
        }
    )
    return data.metas
}

const getAnimeDoc = async (uid: bigint) => {
    const { data } = await axios.get<GetAnimeDocResponse>(
        `${APISERVER_URL}/mikanani/v2/anime/doc?uid=${uid}`, 
        {
            withCredentials: true,
        }
    )
    return data.doc
}

const updateAnimeItem = async (
    uid: bigint, name: string, isActive: boolean,
    regex: string, rssUrl: string, rule: string,
) => {
    await axios.put(
        `${APISERVER_URL}/mikanani/v2/anime/update-meta`,
        {
            uid: uid.toString(),
            name: name,
            is_active: isActive? 1 : -1,
        },
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )

    await axios.put(
        `${APISERVER_URL}/mikanani/v2/anime/update-doc`,
        {
            uid: uid.toString(),
            rule: rule,
            rss_url: rssUrl,
            regex: regex
        },
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}

const insertAnimeItem = async (name: string, rss_url: string, rule: string, regex: string, isActive: boolean) => {
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

const deleteAnimeItem = async (uid: string) => {
    const { status } = await axios.delete(
        `${APISERVER_URL}/mikanani/v2/anime/delete?uid=${uid}`,
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
    getAnimeDoc,
    insertAnimeItem,
    updateAnimeItem,
    deleteAnimeItem,
}