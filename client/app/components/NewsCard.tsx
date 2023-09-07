import { NewsCardProps } from "@/types";
import { Card, CardContent, CardFooter } from "@app/components/ui/card";
import { Badge } from "@app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@app/components/ui/selectStatus";
import { lazy } from "react";

import dayjs from "dayjs";

import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@app/components/ui/skeleton";

const CustomImage = lazy(() => import("./CustomImage"));
const NewsCard = ({
  imagePath,
  newsTitleEn,
  newsDate,
  pkey,
  status,
  handleStatus,
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
          <div className="absolute z-10 top-0 right-1  flex items-center justify-center">
            <Select
              onValueChange={(status) => handleStatus({ pkey, status })}
              defaultValue={status}
            >
              <SelectTrigger className=" p-0 border-0 focus: outline-none">
                <Badge
                  className={` ${bgColor} flex justify-center items-center pt-1`}
                >
                  {status}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="w-20">
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <CustomImage
              newsId={pkey}
              newsTitle={newsTitleEn}
              imagePath={imagePath}
            />
          </Suspense>
        </CardContent>
        <CardFooter className="flex flex-col justify-between items-start py-2">
          <h2 className="text-white text-lg font-bold">{newsTitleEn}</h2>
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
