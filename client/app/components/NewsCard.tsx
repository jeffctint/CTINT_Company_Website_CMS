import { NewsCardProps } from "@/types";
import { Card, CardContent, CardFooter } from "@app/components/ui/card";
import { Badge } from "@app/components/ui/badge";
import { lazy } from "react";

import dayjs from "dayjs";

import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@app/components/ui/skeleton";

const CustomImage = lazy(() => import("./CustomImage"));
const NewsCard = ({
  imagePath,
  newsTitle,
  newsDate,
  pkey,
  status,
}: NewsCardProps) => {
  let bgColor = "";
  switch (status) {
    case "ACTIVE":
      bgColor = "bg-[#97F64D]";
      break;
    case "INACTIVE":
      bgColor = "bg-[#F54F4C]";
      break;
    case "DRAFT":
      bgColor = "bg-[#3174FA]";
      break;

    default:
      break;
  }

  return (
    <Link href={`/newsrooms/${pkey}`}>
      <Card className="border-none overflow-clip bg-[#181f25] cursor-pointer max-h-[320px]">
        <CardContent className="p-0 rounded-lg h-[160px] relative">
          <Badge
            className={`absolute z-10 top-2 right-2 ${bgColor} flex justify-center items-center pt-1`}
          >
            {status}
          </Badge>

          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <CustomImage newsId={pkey} newsTitle={newsTitle} />
          </Suspense>
        </CardContent>
        <CardFooter className="flex flex-col justify-between items-start py-2">
          <h2 className="text-white text-lg font-bold">{newsTitle}</h2>
          <p className="text-[#a9b3c6] text-sm">News Code: {pkey}</p>
          <p className="text-[#a9b3c6] text-sm">
            News Date: {dayjs(newsDate).format("YYYY-MM-D")}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default NewsCard;
