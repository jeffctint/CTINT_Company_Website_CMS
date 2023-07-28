"use client";

import NewsDetailForm from "@app/components/NewsDetailForm";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, cache, use } from "react";
import { FileWithPath } from "@mantine/dropzone";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { DetailPkeyProps } from "@/types";
import { Button } from "@app/components/ui/button";
import dayjs from "dayjs";

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

const infoSchema = z.object({
  name: z.string(),
  website: z.string(),
});

const imgSchema = z.object({
  path: z.string(),
  lastModified: z.number(),
  lastModifiedDate: z.string().datetime(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  webkitRelativePath: z.string(),
});

const news = z
  .object({
    newsTitle: z.string(),
    newsDate: z.date(),
    newsContentEn: z.string(),
    newsContentHk: z.string(),
    newsContentJp: z.string(),
    newsContentCn: z.string(),
    info: z.array(infoSchema),
    status: z.string(),
    imgUrls: z.array(imgSchema),
  })
  .partial();

const newsSchema = news.required({
  newsTitle: true,
  newsDate: true,
  newsContentEn: true,
  status: true,
});

// component here

const NewsDetail = ({ params: { pkey } }: DetailPkeyProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [files, setFiles] = useState<FileWithPath[]>([]); //upload images
  const router = useRouter();

  const newsDetailQuery = useQuery({
    queryKey: ["detail", pkey],
    queryFn: () => getNewsDetailByPkey(pkey),
  });

  console.log("pkey", pkey, newsDetailQuery);

  const detail = newsDetailQuery?.data?.data?.newsContent[0]; // fetched data
  const info = newsDetailQuery?.data?.data?.info;
  const images = newsDetailQuery?.data?.data?.images;

  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      newsTitle: detail?.newsTitle,
      newsDate: new Date(),
      newsContentEn: "",
      newsContentHk: "",
      status: "",
      // info: infoFields,
    },
  });
  const { control, register, handleSubmit, watch } = form;
  console.log(33333, watch("newsTitle"));

  const { fields, append, remove } = useFieldArray({
    control,
    name: "info",
  });

  const onFinishHandler = async (values: any) => {
    // const customResource = values.info.map((item: any) => {
    //   return {
    //     ...item,
    //     referenceCode: "ALL",
    //     referenceType: "NEWSROOM",
    //   };
    // });

    // const customImages = files.map((image: any) => {
    //   return {
    //     ...image,
    //     path: image.path,
    //     name: image.name,
    //   };
    // });

    // const body = {
    //   newsTitle: values.newsTitle,
    //   newsContent: values.newsContentEn,
    //   newsContentEn: values.newsContentEn,
    //   newsContentHk: values.newsContentHk,
    //   newsContentJp: values.newsContentJp,
    //   newsContentCn: values.newsContentCn,
    //   newsDate: values.newsDate,
    //   resourceList: customResource ?? [],
    //   imagePath: files[0].path ?? "",
    //   // relatedNewsList: null,
    //   createUserPkey: "Jeff",
    //   newsStatus: values.status,
    //   imagesList: customImages,
    // };
    console.log("values", values);

    // try {
    //   // createNewsMutation.mutate(body);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const handleUpload = (data: any) => {
    setFiles(data);
  };

  if (newsDetailQuery.isFetching) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="flex w-full h-[1000px] justify-center overflow-auto relative">
      <Button
        className="bg-[#97f64d] text-[#181f25] hover:bg-[#67aa34] absolute px-8 py-4 top-8 right-8"
        onClick={() => setIsEdit(!isEdit)}
      >
        Edit
      </Button>
      <div className="flex flex-col p-8 w-1/2 max-w-[800px] min-h-full">
        <div className="flex flex-row items-center space-x-4 border-b-[1px] border-[#454e5f] pb-4 mb-4">
          <h1 className="font-bold text-4xl text-white">News Detail</h1>
          <span className="text-md text-white">News code: {detail?.code}</span>
        </div>
        <NewsDetailForm
          type="Edit"
          handleSubmit={handleSubmit}
          onFinishHandler={onFinishHandler}
          form={form}
          control={control}
          register={register}
          fields={fields}
          append={append}
          remove={remove}
          files={files}
          handleUpload={handleUpload}
          isLoading={false}
          newsDetail={detail}
          info={info}
          images={images}
          isEdit={isEdit}
        />
      </div>
    </div>
  );
};

export default NewsDetail;
