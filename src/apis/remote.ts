import { APISERVER_URL } from "../configs/remote";
import axios from "axios";

type Meta = {
  uid: string;
  name: string;
  downloadBitmap: string;
  isActive: boolean;
};

type GetAnimeCountResponse = {
  count: number;
};

type GetAnimeListResponse = {
  itemCount: bigint;
  animeMetas: Array<Meta>;
};

type InsertAnimeItemResponse = {
  uid: string;
};

type AnimeDoc = {
  uid: string;
  rssUrl: string;
  rule: string;
  regex: string;
};

type GetAnimeDocResponse = {
  animeDoc: AnimeDoc;
};

const getAnimeCount = async () => {
  const { data } = await axios.get<GetAnimeCountResponse>(
    `${APISERVER_URL}/mikanani/v2/anime/anime-count`,
    {
      withCredentials: true,
    },
  );
  return data.count;
};

const getAnimeList = async (
  startIndex: bigint,
  endIndex: bigint,
  statusFilter: bigint,
) => {
  const { data } = await axios.get<GetAnimeListResponse>(
    `${APISERVER_URL}/mikanani/v2/anime/list-meta?startIndex=${startIndex}&statusFilter=${statusFilter}&endIndex=${endIndex}`,
    {
      withCredentials: true,
    },
  );
  return data.animeMetas;
};

const getAnimeDoc = async (uid: string) => {
  const { data } = await axios.get<GetAnimeDocResponse>(
    `${APISERVER_URL}/mikanani/v2/anime/doc/${uid}`,
    {
      withCredentials: true,
    },
  );
  return data.animeDoc;
};

const updateAnimeItem = async (
  uid: string,
  name: string,
  isActive: boolean,
  regex: string,
  rssUrl: string,
  rule: string,
) => {
  await axios.put(
    `${APISERVER_URL}/mikanani/v2/anime/update-meta`,
    {
      updateAnimeMeta: {
        uid: uid.toString(),
        name: name,
        is_active: isActive ? 1 : -1,
      },
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  await axios.put(
    `${APISERVER_URL}/mikanani/v2/anime/update-doc`,
    {
      updateAnimeDoc: {
        uid: uid.toString(),
        rule: rule,
        rss_url: rssUrl,
        regex: regex,
      }
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

const insertAnimeItem = async (
  name: string,
  rss_url: string,
  rule: string,
  regex: string,
  isActive: boolean,
) => {
  const { status, data } = await axios.post<InsertAnimeItemResponse>(
    `${APISERVER_URL}/mikanani/v2/anime/insert`,
    {
      insertAnimeMeta: {
        name: name,
        isActive: isActive ? 1 : -1,
      },
      insertAnimeDoc: {
        rssUrl: rss_url,
        rule: rule,
        regex: regex,
      },
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  // for debug
  // console.log(data.metas)
  return { status: status, data: data };
};

const deleteAnimeItem = async (uid: string) => {
  const { status } = await axios.delete(
    `${APISERVER_URL}/mikanani/v2/anime/delete/${uid}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  // for debug
  // console.log(data.metas)
  return status;
};

const uploadAnimeImage = async (uid: string, imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  await axios.post(
    `${APISERVER_URL}/mikanani/v2/pics/upload/${uid}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export {
  getAnimeCount,
  getAnimeList,
  getAnimeDoc,
  insertAnimeItem,
  updateAnimeItem,
  deleteAnimeItem,
  uploadAnimeImage,
};
