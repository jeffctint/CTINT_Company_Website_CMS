import { NewsProps } from "@/types";
import CreateButton from "@app/components/CreateButton";
import NewsCard from "../components/NewsCard";

// const fakeNews: NewsCardProps[] = [
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1689089764982-3c081cc0089a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80",
//     newsTitle: "Title1",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1688890239467-c43da335fe7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
//     newsTitle: "Title2",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1661956603025-8310b2e3036d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
//     newsTitle: "Title3",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1688025950970-2ffb840b8f64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
//     newsTitle: "Title4",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1689045306229-5ecee1d55998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
//     newsTitle: "Title5",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1689045306229-5ecee1d55998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
//     newsTitle: "Title6",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1689089764982-3c081cc0089a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80",
//     newsTitle: "Title7",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1688890239467-c43da335fe7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
//     newsTitle: "Title8",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1689039993843-7b1aaf1f2e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
//     newsTitle: "Title9",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1688025950970-2ffb840b8f64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
//     newsTitle: "Title10",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1689039993843-7b1aaf1f2e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
//     newsTitle: "Title11",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
//   {
//     imagePkey:
//       "https://images.unsplash.com/photo-1689039993843-7b1aaf1f2e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
//     newsTitle: "Title12",
//     newsDate: "2022-6-30",
//     code: "ioadsfakciadsml",
//   },
// ];

const getNewsList = async () => {
  const res = await fetch("http://localhost:10443/v1/interactions", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-store", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return res;
};

const Newsrooms = async () => {
  const news = await getNewsList();

  return (
    <div className="flex flex-col text-white text-2xl overflow-y-auto">
      <div className="p-4 flex flex-row justify-between items-center w-full">
        <h1 className="text-4xl text-white font-bold">NEWSROOMS</h1>
        <CreateButton pathname="/newsrooms/create" />
      </div>
      <div className="p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {news.data.map(
          ({ imagePkey, newsTitle, newsDate, code }: NewsProps) => (
            <NewsCard
              imagePkey={imagePkey}
              newsTitle={newsTitle}
              newsDate={newsDate}
              code={code}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Newsrooms;
