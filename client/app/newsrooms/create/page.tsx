"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import * as z from "zod";

import CreateNewsForm from "@app/components/CreateNewsForm";

import { FileWithPath } from "@mantine/dropzone";
import { useFieldArray, useForm } from "react-hook-form";

import { CreateNewsProps } from "@/types";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { revalidateTag } from "next/cache";
import { newsKeys } from "@/features/queries";

const infoSchema = z.object({
  name: z.string(),
  website: z.string(),
});

const relatedNewsSchema = z.object({
  referenceCode: z.string(),
});

// const imgSchema = z.object({
//   path: z.string(),
//   lastModified: z.number(),
//   lastModifiedDate: z.string().datetime(),
//   name: z.string(),
//   size: z.number(),
//   type: z.string(),
//   webkitRelativePath: z.string(),
// });

const news = z
  .object({
    newsTitleEn: z
      .string({
        required_error: "EN Title is required",
      })
      .min(1, { message: "News Title Required" }),
    newsTitleCn: z.string(),
    newsTitleHk: z.string(),
    newsTitleJp: z.string(),
    newsDate: z.date({
      required_error: "Date is required",
    }),
    newsContentEn: z
      .string({
        required_error: "News Content EN is required",
      })
      .min(1, { message: "News Content En Required" }),
    newsContentHk: z.string(),
    newsContentJp: z.string(),
    newsContentCn: z.string(),
    info: z.array(infoSchema),
    relatedNews: z.array(relatedNewsSchema),
    status: z.string(),
    // imgUrls: z.array(imgSchema),
  })
  .partial();

const newsSchema = news.required({
  newsTitleEn: true,
  newsContentEn: true,
  newsDate: true,
});

const convertToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

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
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const createNewsMutation = useMutation({
    mutationFn: createNews,
    onSuccess: (res) => {
      queryClient.invalidateQueries(newsKeys.list("ALL"));
      if (res.errMsg === "" && res.isSuccess) {
        router.push("/newsrooms");
      }
    },
  });
  const router = useRouter();
  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      newsTitleEn: "",
      newsTitleHk: "",
      newsTitleCn: "",
      newsTitleJp: "",

      // newsDate: new Date(),
      // newsContentEn: "",
      // newsContentHk: "",
    },
  });

  const { control, register, handleSubmit, watch } = form;
  console.log(watch("newsDate"));
  const {
    fields: infoFields,
    append: infoAppend,
    remove: infoRemove,
  } = useFieldArray({
    control,
    name: "info",
  });

  const {
    fields: relatedNewsFields,
    append: relatedNewsAppend,
    remove: relatedNewsRemove,
  } = useFieldArray({
    control,
    name: "relatedNews",
  });

  const [files, setFiles] = useState<FileWithPath[]>([]); //upload images

  // const previews = files.map((file: any, index: number) => {
  //   //mantine show images previews
  //   const imageUrl = URL.createObjectURL(file);
  //   return (
  //     <img
  //       width={"100%"}
  //       height={"100%"}
  //       key={index}
  //       src={imageUrl}
  //       alt={file.name}
  //       className=" object-cover"
  //     />
  //   );
  // });

  const onFinishHandler = async (values: z.infer<typeof newsSchema>) => {
    const customResource = values?.info?.map((item: any) => {
      return {
        ...item,
        referenceCode: "ALL",
        referenceType: "NEWSROOM",
      };
    });

    const customImages = files.map(async (image: any, i: number) => {
      const resultString = await convertToBase64(image);

      return {
        ...image,
        path: image.path,
        name: image.name,
        imageString: resultString,
        position: i
      };
    });

    const body = {
      newsTitleEn: values.newsTitleEn,
      newsTitleCn: values.newsTitleCn,
      newsTitleHk: values.newsTitleHk,
      newsTitleJp: values.newsTitleJp,
      newsContentEn: values.newsContentEn,
      newsContentHk: values.newsContentHk,
      newsContentJp: values.newsContentJp,
      newsContentCn: values.newsContentCn,
      newsDate: values.newsDate,
      resourceList: customResource ?? [],
      imagePath: files.length !== 0 ? files?.[0].path : "",
      relatedNewsList: values?.relatedNews,
      createUserPkey: session?.user?.name!,
      newsStatus: "ACTIVE",
      imagesList: await Promise.all(customImages),
    };

    try {
      console.log("body", body);
      createNewsMutation.mutate(body);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAsDraft = async (values: any) => {
    console.log("draft", values);
    const customResource = values?.info?.map((item: any) => {
      return {
        ...item,
        referenceCode: "ALL",
        referenceType: "NEWSROOM",
      };
    });

    const customImages = files.map(async (image: any, i: number) => {
      const resultString = await convertToBase64(image);

      return {
        ...image,
        path: image.path,
        name: image.name,
        imageString: resultString,
        position: i
      };
    });

    const body = {
      newsTitleEn: values.newsTitleEn,
      newsTitleCn: values.newsTitleCn,
      newsTitleHk: values.newsTitleHk,
      newsTitleJp: values.newsTitleJp,
      newsContentEn: values.newsContentEn,
      newsContentHk: values.newsContentHk,
      newsContentJp: values.newsContentJp,
      newsContentCn: values.newsContentCn,
      newsDate: values.newsDate,
      resourceList: customResource ?? [],
      imagePath: files.length !== 0 ? files?.[0].path : "",
      relatedNewsList: values?.relatedNews,
      createUserPkey: session?.user?.name!,
      newsStatus: "DRAFT",
      imagesList: await Promise.all(customImages),
    };

    try {
      console.log("body", body);
      createNewsMutation.mutate(body);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = (data: any) => {
    setFiles([...files, ...data]);
  };

  const removeImages = (index: number) => {
    setFiles(files.filter((item, i) => i !== index));
  };

  return (
    <div className="flex w-full h-[1000px] justify-center overflow-auto">
      <div className="flex flex-col p-8 w-1/2 max-w-[800px] min-h-full">
        <div className="border-b-[1px] border-[#454e5f] pb-4 mb-4">
          <h1 className="font-bold text-4xl text-white">Create News</h1>
        </div>
        <CreateNewsForm
          type="Create"
          handleSubmit={handleSubmit}
          onFinishHandler={onFinishHandler}
          form={form}
          register={register}
          infoFields={infoFields}
          infoAppend={infoAppend}
          infoRemove={infoRemove}
          relatedNewsFields={relatedNewsFields}
          relatedNewsAppend={relatedNewsAppend}
          relatedNewsRemove={relatedNewsRemove}
          files={files}
          handleUpload={handleUpload}
          isLoading={createNewsMutation.isLoading}
          removeImages={removeImages}
          handleSaveAsDraft={handleSaveAsDraft}
        />
      </div>
    </div>
  );
};

export default CreateNews;
