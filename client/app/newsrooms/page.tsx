"use client";

import { NewsProps } from "@/types";
import NewsCard from "../components/NewsCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { newsKeys } from "@/features/queries";

import CreateButton from "@app/components/CreateButton";
import { Badge } from "@app/components/ui/badge";
import { getNewsList, updateStatus } from "@/features/newsrooms/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/router";
import Loading from "./loading";
interface ListStatus {
  status: string;
}

const listStatus: ListStatus[] = [
  { status: "ALL" },
  { status: "ACTIVE" },
  { status: "INACTIVE" },
  { status: "DRAFT" },
];

const Newsrooms = () => {
  const [status, setStatus] = useState<string>("ALL");
  const queryClient = useQueryClient();

  const newsListQuery = useQuery({
    queryKey: newsKeys.list(status, '0'),
    queryFn: async () => await getNewsList(status, '0'),
    cacheTime: 1000 * 60 * 10
  });

  const list = newsListQuery.data?.newsContent;

  const fetchStatus = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(newsKeys.list("ALL", '0'));
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log("error", error, "variables", variables, "context", context);
    },
  });

  const handleStatusUpdate = ({ pkey, status }: any) => {
    fetchStatus.mutate({ pkey, status });
  };

  if (newsListQuery.isFetching) {
    return <Loading />
  }

  if (!list) {
    return null;
  }


  return (
    <div className="flex flex-col text-white text-2xl overflow-y-auto">
      <div className="p-4 flex flex-row justify-between items-center w-full">
        <div className="flex flex-row items-center space-x-4">
          <h1 className="text-4xl text-white font-bold">NEWSROOMS</h1>

          {listStatus.map((item: ListStatus) => (
            <Badge
              key={item.status}
              onClick={() => setStatus(item.status)}
              className={` flex justify-center items-center pt-1 mr-2 ${item.status === status
                ? "bg-[#97F64D] text-[#707A8F]"
                : "bg-[#707A8F] "
                } cursor-pointer`}
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
              handleStatus={handleStatusUpdate}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Newsrooms;
