import { NewsCardProps } from "@/types";
import { Card, CardContent, CardFooter } from "@app/components/ui/card";
import { Badge } from "@app/components/ui/badge";

import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

const badgeStatus = [
  { ACTIVE: "#97F64D" },
  { INACTIVE: "#F54F4C" },
  { DRAFT: "#FEFEF6" },
];

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
      bgColor = "bg-[#707A8F]";
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

          <Image
            // width={380}
            // height={163}
            fill
            src={imagePath ? imagePath : "/images/logo.png"}
            alt={newsTitle}
          />
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
