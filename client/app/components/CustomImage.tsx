import Image from "next/image";

const getNewsDetailByPkey = (pkey: string) => {
  const res = fetch(`http://localhost:10443/v1/newsrooms/${pkey}`, {
    method: "GET",
    mode: "cors",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return res;
};

const CustomImage = async ({ newsId, newsTitle }: any) => {
  const detail = await getNewsDetailByPkey(newsId);

  const image = detail?.data?.images[0]?.imageString;

  return (
    <div>
      <Image
        width={380}
        height={163}
        src={image ? image : "/images/logo.png"}
        alt={newsTitle}
        loading="lazy"
        className="h-40"
      />
    </div>
  );
};

export default CustomImage;
