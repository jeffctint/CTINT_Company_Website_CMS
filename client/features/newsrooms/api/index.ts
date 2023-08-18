import { CreateNewsProps, UpdateNewsProps } from "@/types";

export const getNewsList = async (status: string) => {
  let stringUrl = `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/newsrooms`;
  let url = new URL(stringUrl);
  let params = url.searchParams;
  params.append("status", status);

  const res = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },

    next: {
      tags: ["newsList"],
    },
  }).then((res) => res.json());

  return res.data;
};

export const getNewsDetailByPkey = (pkey: string) => {
  const res = fetch(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/newsrooms/${pkey}`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  return res;
};

export const createNews = async (data: CreateNewsProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/newsrooms/createNews`,
    {
      method: "POST",
      mode: "cors",
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  ).then((res) => res.json());

  return res;
};

export const updateNews = async (data: UpdateNewsProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/newsrooms/updateNews`,
    {
      method: "PUT",
      mode: "cors",
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  ).then((res) => res.json());

  return res;
};
