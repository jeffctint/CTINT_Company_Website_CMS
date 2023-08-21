import { getNewsDetailByPkey } from "@/features/newsrooms/api";
import { newsKeys } from "@/features/queries";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Skeleton } from "@/app/components/ui/skeleton";

const CustomImage = async ({ newsId, newsTitle, imagePath }: any) => {
  const newsDetailQuery = useQuery({
    queryKey: newsKeys.detail(newsId),
    queryFn: async () => await getNewsDetailByPkey(newsId),
  });

  const image = newsDetailQuery?.data?.data?.images[0]?.imageString;
  // newsDetailQuery.isFetched;
  return (
    <div>
      {newsDetailQuery.isFetched ? (
        <Image
          width={380}
          height={163}
          src={image}
          alt={newsTitle}
          loading="lazy"
          className="h-40"
        />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );

  // return (
  //   <Image
  //     width={380}
  //     height={163}
  //     src={imagePath}
  //     alt={newsTitle}
  //     loading="lazy"
  //     className="h-40"
  //   />
  // );
};

export default CustomImage;
