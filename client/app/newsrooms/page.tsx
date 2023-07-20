"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@app/components/ui/button";
import NewsCard from "../components/NewsCard";
import { NewsCardProps } from "@/types";
import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fakeNews: NewsCardProps[] = [
  {
    imagePkey:
      "https://images.unsplash.com/photo-1689089764982-3c081cc0089a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80",
    newsTitle: "Title1",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1688890239467-c43da335fe7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    newsTitle: "Title2",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1661956603025-8310b2e3036d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    newsTitle: "Title3",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1688025950970-2ffb840b8f64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    newsTitle: "Title4",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1689045306229-5ecee1d55998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    newsTitle: "Title5",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1689045306229-5ecee1d55998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    newsTitle: "Title6",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1689089764982-3c081cc0089a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80",
    newsTitle: "Title7",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1688890239467-c43da335fe7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    newsTitle: "Title8",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1689039993843-7b1aaf1f2e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    newsTitle: "Title9",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1688025950970-2ffb840b8f64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    newsTitle: "Title10",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1689039993843-7b1aaf1f2e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    newsTitle: "Title11",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
  {
    imagePkey:
      "https://images.unsplash.com/photo-1689039993843-7b1aaf1f2e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    newsTitle: "Title12",
    newsDate: "2022-6-30",
    code: "ioadsfakciadsml",
  },
];

// const getData = async () => {
//   const res = fetch("https://jsonplaceholder.typicode.com/posts", {
//     method: "GET", // *GET, POST, PUT, DELETE, etc.
//     mode: "cors", // no-cors, *cors, same-origin
//     cache: "no-store", // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: "same-origin", // include, *same-origin, omit
//     headers: {
//       "Content-Type": "application/json",
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });
//   const data = (await res).json();
//   // setNews(await data);
// };

const Newsrooms = async () => {
  // const { status, data } = useSession();
  const router = useRouter();
  // const [news, setNews] = useState([]);

  // const news = await getData();

  // console.log("news", news);

  // const { data, isLoading } = useQuery({
  //   // networkMode: "offlineFirst",
  //   queryKey: ["news"],
  //   // cacheTime: 0,
  //   // staleTime: 99999999999,

  //   queryFn: async () => {
  //     await axios("http://localhost:10443/v1/interactions", {
  //       method: "POST", // *GET, POST, PUT, DELETE, etc.

  //       headers: {
  //         "Content-Type": "application/json",
  //         // 'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //     });
  //   },
  // });

  // if (!data || isLoading) {
  //   return <div>is loading</div>;
  // }

  // console.log("fetch data", data);

  return (
    <div className="flex flex-col text-white text-2xl overflow-y-auto">
      <div className="p-4 flex flex-row justify-between items-center w-full">
        <h1 className="text-4xl text-white font-bold">NEWSROOMS</h1>
        <Button
          onClick={() => router.push("/newsrooms/create")}
          className="text-[#181f25] bg-[#97f64d] hover:bg-[#71b93a]"
        >
          Create
        </Button>
      </div>
      <div className="p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* {fakeNews.map((news, i) => (
          <NewsCard />
        ))} */}
        <NewsCard />
      </div>
    </div>
  );
};

export default Newsrooms;

// export async function getServerSideProps() {
//   const res = await fetch("http://localhost:10443/v1/interactions", {
//     method: "POST", // *GET, POST, PUT, DELETE, etc.
//     mode: "cors", // no-cors, *cors, same-origin
//     // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: "same-origin", // include, *same-origin, omit
//     headers: {
//       "Content-Type": "application/json",
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });
//   const data = await res.json();

//   if (!data) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       news: data,
//     }, // will be passed to the page component as props
//   };
// }
