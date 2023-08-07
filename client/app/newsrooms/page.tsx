import { NewsProps } from "@/types";
import CreateButton from "@app/components/CreateButton";
import NewsCard from "../components/NewsCard";

const getNewsList = async () => {
  const res = await fetch("http://localhost:10443/v1/newsrooms", {
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

  return res;
};

const Newsrooms = async () => {
  const news = await getNewsList();

  console.log("news", news);

  return (
    <div className="flex flex-col text-white text-2xl overflow-y-auto">
      <div className="p-4 flex flex-row justify-between items-center w-full">
        <h1 className="text-4xl text-white font-bold">NEWSROOMS</h1>
        <CreateButton pathname="/newsrooms/create" />
      </div>
      <div className="p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {news.data.newsContent.map(
          ({ newsTitle, newsDate, pkey, imagePath }: NewsProps) => (
            <NewsCard
              imagePath={imagePath[0]?.imageString ?? ""}
              newsTitle={newsTitle}
              newsDate={newsDate}
              pkey={pkey}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Newsrooms;
