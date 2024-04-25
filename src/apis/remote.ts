import axios from "axios";
import { APISERVER_URL } from "../configs/remote";

type Meta = {
  uid: string;
  name: string;
  bitmap: string;
  isActive: boolean;
};

type GetAnimeCountResponse = {
  count: number;
};

type GetAnimeListResponse = {
  count: bigint;
  metas: Array<Meta>;
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
  doc: AnimeDoc;
};

const getAnimeCount = async () => {
  const { data } = await axios.get<GetAnimeCountResponse>(
    `${APISERVER_URL}/mikanani/v2/anime/`,
    {
      withCredentials: true,
    },
  );
  return data.count;
};

const getAnimeList = async (
  start: bigint,
  end: bigint,
  status_filter: bigint,
) => {
  const { data } = await axios.get<GetAnimeListResponse>(
    `${APISERVER_URL}/mikanani/v2/anime/list-meta?start=${start}&status_filter=${status_filter}&end=${end}`,
    {
      withCredentials: true,
    },
  );
  return data.metas;
};

const getAnimeDoc = async (uid: string) => {
  const { data } = await axios.get<GetAnimeDocResponse>(
    `${APISERVER_URL}/mikanani/v2/anime/doc?uid=${uid}`,
    {
      withCredentials: true,
    },
  );
  return data.doc;
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
      uid: uid.toString(),
      name: name,
      is_active: isActive ? 1 : -1,
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
      uid: uid.toString(),
      rule: rule,
      rss_url: rssUrl,
      regex: regex,
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
      name: name,
      rss_url: rss_url,
      rule: rule,
      regex: regex,
      is_active: isActive ? 1 : -1,
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
    `${APISERVER_URL}/mikanani/v2/anime/delete?uid=${uid}`,
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
    `${APISERVER_URL}/mikanani/v2/anime/pics/upload/${uid}`,
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
