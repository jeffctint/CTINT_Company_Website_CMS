import parse from "html-react-parser";

const getNewsDetailByPkey = async (pkey: string) => {
  const res = await fetch(`http://localhost:10443/v1/newsrooms/${pkey}`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-store", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return res;
};

const NewsDetail = async ({
  params: { pkey },
}: {
  params: { pkey: string };
}) => {
  const newsDetail = await getNewsDetailByPkey(pkey);
  const { data } = newsDetail;
  const { result } = data;
  const { recordsets } = result;
  const detail = recordsets[0][0];

  return (
    <div className="flex flex-col space-y-4 p-4 items-center justify-center w-full h-screen text-white ">
      <div>{detail.pkey}</div>
      <div className="text-4xl">{detail.newsTitle}</div>
      <div className="w-1/2">{parse(detail.newsContent)}</div>
    </div>
  );
};

export default NewsDetail;
