"use client";

import { NewsProps } from "@/types";
import NewsCard from "../components/NewsCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { newsKeys } from "@/features/queries";

import CreateButton from "@app/components/CreateButton";
import { Badge } from "@app/components/ui/badge";
interface ListStatus {
  status: string;
  color: string;
}

const listStatus: ListStatus[] = [
  { status: "ALL", color: "#FB8530" },
  { status: "ACTIVE", color: "#97F64D" },
  { status: "INACTIVE", color: "#F54F4C" },
  { status: "DRAFT", color: "#3174FA" },
];

const getNewsList = async (status: string) => {
  let stringUrl = "http://localhost:10443/v1/newsrooms";
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

const Newsrooms = () => {
  const [status, setStatus] = useState<string>("ALL");
  // const news = await getNewsList();
  const newsListQuery = (status: string) =>
    useQuery({
      queryKey: newsKeys.list(status),
      queryFn: async () => await getNewsList(status),
      cacheTime: 100,
    });

  // const [newsList, setNewsList] = useState([]);
  const list = newsListQuery(status)?.data?.newsContent;
  // console.log("list", newsListQuery("ACTIVE"));

  return (
    <div className="flex flex-col text-white text-2xl overflow-y-auto">
      <div className="p-4 flex flex-row justify-between items-center w-full">
        <div className="flex flex-row items-center space-x-4">
          <h1 className="text-4xl text-white font-bold">NEWSROOMS</h1>
          {listStatus.map((item: ListStatus) => (
            <Badge
              key={item.color}
              onClick={() => setStatus(item.status)}
              className={` flex justify-center items-center pt-1 mr-2 cursor-pointer`}
              style={{ backgroundColor: item.color }}
            >
              {item.status}
            </Badge>
          ))}
        </div>

        <CreateButton pathname="/newsrooms/create" />
      </div>
      <div className="p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {list?.map(
          ({ newsTitleEn, newsDate, pkey, imagePath, status }: NewsProps) => (
            <NewsCard
              key={pkey}
              imagePath={imagePath[0]?.imageString ?? ""}
              newsTitleEn={newsTitleEn}
              newsDate={newsDate}
              pkey={pkey}
              status={status}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Newsrooms;
