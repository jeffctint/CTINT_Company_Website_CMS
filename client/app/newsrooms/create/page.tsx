"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import * as z from "zod";
import parse from "html-react-parser";

import CreateNewsForm from "@app/components/CreateNewsForm";

import { FileWithPath } from "@mantine/dropzone";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

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

const newsformSchema = z
  .object({
    newsTitle: z.string(),
    newsDate: z.date(),
    newsContentEn: z.string(),
    newsContentHk: z.string(),
    info: z.array(infoSchema),
    status: z.string(),
    imgUrls: z.array(imgSchema),
  })
  .partial();

const CreateNews = () => {
  const [title, setTitle] = useState("");
  const form = useForm<z.infer<typeof newsformSchema>>({
    resolver: zodResolver(newsformSchema),
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

  const onFinishHandler = (values: any) => {
    values = {
      ...values,
      images: files,
    };
    console.log(1111, values);
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
