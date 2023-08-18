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
import { updateStatus } from "@/features/newsrooms/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newsKeys } from "@/features/queries";
import { useRouter } from "next/router";

const CustomImage = lazy(() => import("./CustomImage"));
const NewsCard = ({
  imagePath,
  newsTitleEn,
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

  // const router = useRouter();

  const queryClient = useQueryClient();

  const fetchStatus = useMutation({
    mutationFn: updateStatus,
    onSuccess: (res) => {
      console.log("res", res);

      // ✅ update the list we are currently on instantly
      queryClient.setQueryData(newsKeys.list("ALL"), (previous: any) => {
        if (previous) {
          const oldItem = previous.newsContent.find(
            (item: any) => item.pkey === res.pkey
          );
          const newItem = { ...oldItem, status: res.status };
          return [...previous, newItem];
        } else {
          return previous;
        }
      });
      // queryClient.invalidateQueries(newsKeys.list("ALL"));
      // if (res.errMsg === "" && res.isSuccess) {
      //   router.push("/newsrooms");
      // }
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log("error", error, "variables", variables, "context", context);
    },
  });

  return (
    <Link href={`/newsrooms/${pkey}`}>
      <Card className="border-none overflow-clip bg-[#181f25] cursor-pointer max-h-[320px]">
        <CardContent className="p-0 rounded-lg h-[160px] relative">
          <div className="absolute z-10 top-2 right-2  flex items-center justify-center">
            <Select
              onValueChange={(status) => fetchStatus.mutate({ pkey, status })}
              defaultValue={status}
            >
              <SelectTrigger className=" p-0 border-0">
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
            <CustomImage newsId={pkey} newsTitle={newsTitleEn} />
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
