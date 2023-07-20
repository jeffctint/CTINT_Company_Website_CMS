import { NewsCardProps, NewsProps } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import Image from "next/image";

// "https://images.unsplash.com/photo-1689089764982-3c081cc0089a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80"

const NewsCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["news"],

    queryFn: () =>
      fetch("http://localhost:10443/v1/interactions", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  });

  if (!data || isLoading) {
    return <div>is loading</div>;
  }

  console.log("fetch data", data);

  return (
    <>
      {data.data.map((item: NewsProps) => (
        <Card
          key={item.code}
          className="border-none overflow-clip bg-[#181f25] cursor-pointer"
        >
          <CardContent className="p-0 rounded-lg">
            <Image
              width={380}
              height={320}
              src={`https://ctint-website.azurewebsites.net/newsroom/${item.imagePkey}`}
              alt={item.newsTitle}
            />
          </CardContent>
          <CardFooter className="flex flex-col justify-between items-start py-2">
            <h2 className="text-white text-lg font-bold">{item.newsTitle}</h2>
            <p className="text-[#a9b3c6] text-sm">News Code: {item.pkey}</p>
            <p className="text-[#a9b3c6] text-sm">
              News Date: {dayjs(item.newsDate).format("YYYY-MM-D")}
            </p>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default NewsCard;
