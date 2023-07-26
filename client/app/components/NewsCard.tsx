import { NewsCardProps } from "@/types";
import { Card, CardContent, CardFooter } from "@app/components/ui/card";

import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

const NewsCard = ({ imagePath, newsTitle, newsDate, pkey }: NewsCardProps) => {
  return (
    <Link href={`/newsrooms/${pkey}`}>
      <Card className="border-none overflow-clip bg-[#181f25] cursor-pointer">
        <CardContent className="p-0 rounded-lg">
          <Image
            width={380}
            height={320}
            src={`https://ctint-website.azurewebsites.net/newsroom/${imagePath}`}
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
