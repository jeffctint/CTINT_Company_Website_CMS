import { NewsCardProps } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";
import Image from "next/image";

// "https://images.unsplash.com/photo-1689089764982-3c081cc0089a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80"

const NewsCard = ({ imagePkey, newsTitle, newsDate, code }: NewsCardProps) => {
  return (
    <Card className="border-none overflow-clip bg-[#181f25] cursor-pointer">
      <CardContent className="p-0 rounded-lg">
        <Image width={380} height={320} src={imagePkey} alt={newsTitle} />
      </CardContent>
      <CardFooter className="flex flex-col justify-between items-start py-2">
        <h2 className="text-white text-lg font-bold">{newsTitle}</h2>
        <p className="text-[#a9b3c6] text-sm">News Code: {code}</p>
        <p className="text-[#a9b3c6] text-sm">News Date: {newsDate}</p>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
