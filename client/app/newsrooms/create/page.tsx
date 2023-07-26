"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import * as z from "zod";
import parse from "html-react-parser";

import CreateNewsForm from "@app/components/CreateNewsForm";

import { FileWithPath } from "@mantine/dropzone";
import {
  useFieldArray,
  useForm,
  useWatch,
  SubmitHandler,
} from "react-hook-form";

import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import Link from "next/link";
import { CreateNewsProps } from "@/types";
import { useRouter } from "next/navigation";

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

const createNews = async (data: CreateNewsProps) => {
  const res = await fetch("http://localhost:10443/v1/newsrooms/createNews", {
    method: "POST",
    mode: "cors",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

  return res;
};

const CreateNews = () => {
  // const [title, setTitle] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      newsTitle: "",
      newsDate: new Date(),
      newsContentEn: "",
      newsContentHk: "",
    },
  });

  const { control, register, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "info",
  });

  const watchNewsTitle = useWatch({ control, name: "newsTitle" });
  const watchNewsDate = useWatch({ control, name: "newsDate" });
  const watchNewsContentEn = useWatch({ control, name: "newsContentEn" });
  const watchNewsContentHk = useWatch({ control, name: "newsContentHk" });
  const watchInfo = useWatch({ control, name: "info" });

  const [files, setFiles] = useState<FileWithPath[]>([]); //upload images

  const previews = files.map((file: any, index: number) => {
    //mantine show images previews
    const imageUrl = URL.createObjectURL(file);
    return (
      <img
        width={"100%"}
        height={"100%"}
        key={index}
        src={imageUrl}
        alt={file.name}
        className=" object-cover"
      />
    );
  });

  const onFinishHandler = async (values: any) => {
    const customResource = values.info.map((item: any) => {
      return {
        ...item,
        referenceCode: "ALL",
        referenceType: "NEWSROOM",
      };
    });

    const customImages = files.map((image: any) => {
      return {
        ...image,
        path: image.path,
        name: image.name,
      };
    });

    const body = {
      newsTitle: values.newsTitle,
      newsContent: values.newsContentEn,
      newsContentEn: values.newsContentEn,
      newsContentHk: values.newsContentHk,
      newsContentJp: values.newsContentJp,
      newsContentCn: values.newsContentCn,
      newsDate: values.newsDate,
      resourceList: customResource ?? [],
      imagePath: files[0].path ?? "",
      // relatedNewsList: null,
      createUserPkey: "Jeff",
      newsStatus: values.status,
      imagesList: customImages,
    };

    try {
      await createNews(body).then((res) => {
        if (res.errMsg === "" && res.isSuccess) {
          router.push("/newsrooms");
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = (data: any) => {
    setFiles(data);
  };

  return (
    <div className="flex flex-row w-full h-[1000px] overflow-auto">
      <div className="flex flex-col p-8 w-1/2 min-h-full">
        <div className="border-b-[1px] border-[#454e5f] pb-4 mb-4">
          <h1 className="font-bold text-4xl text-white">Create New News</h1>
        </div>
        <CreateNewsForm
          type="Create"
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
        />
      </div>
      <div className="flex flex-col items-center p-8 w-1/2 min-h-full text-white">
        <div className="mb-4 w-full">{previews[0]}</div>
        <div>
          <h1 className="font-bold text-4xl text-center mb-4">
            {watchNewsTitle}
          </h1>
        </div>

        <div className="w-full flex justify-end mb-4">
          {dayjs(watchNewsDate).format("DD/MMM/YYYY")}
        </div>
        <div className="w-full text-lg mb-4 text-white">
          {parse(watchNewsContentEn!)}
        </div>
        <div className="w-full text-lg mb-4">{parse(watchNewsContentHk!)}</div>
        <div className="w-full">
          {watchInfo?.map((info, i) => (
            <Link
              target="_blank"
              key={i}
              href={info.website}
              className="hover:underline"
            >
              {info.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateNews;
