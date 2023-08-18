"use client";

import NewsDetailForm from "@app/components/NewsDetailForm";

import {
  getNewsDetailByPkey,
  getNewsList,
  updateNews,
} from "@/features/newsrooms/api";
import { newsKeys } from "@/features/queries";
import { DetailPkeyProps } from "@/types";
import { Button } from "@app/components/ui/button";
import { Skeleton } from "@app/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileWithPath } from "@mantine/dropzone";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsArrowLeft } from "react-icons/bs";
import * as z from "zod";

const infoSchema = z.object({
  name: z.string(),
  website: z.string(),
});

const relatedNewsSchema = z.object({
  referenceCode: z.string(),
});

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

// component here

const NewsDetail = ({ params: { pkey } }: DetailPkeyProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [files, setFiles] = useState<FileWithPath[]>([]); //upload images
  const [detailQuery, setDetailQuery] = useState<any>({
    detail: {},
    info: [],
    images: [],
  });
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const newsListQuery = useQuery({
    queryKey: newsKeys.list("ALL"),
    queryFn: async () => await getNewsList("ALL"),
    cacheTime: 100,
  });

  const newsList = newsListQuery?.data?.newsContent;
  console.log("newsList", newsList);
  const newsDetailQuery = useQuery({
    queryKey: newsKeys.detail(pkey),
    queryFn: async () => await getNewsDetailByPkey(pkey),
    cacheTime: 1000,
  });

  const updateNewsMutation = useMutation({
    mutationFn: updateNews,
    onSuccess: (res) => {
      queryClient.invalidateQueries(newsKeys.list("ALL"));
      if (res.errMsg === "" && res.isSuccess) {
        router.push("/newsrooms");
      }
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log("error", error, "variables", variables, "context", context);
    },
  });

  const detail = newsDetailQuery?.data?.data?.newsContent[0]; // fetched data
  const info = newsDetailQuery?.data?.data?.info;
  const relatedNews = newsDetailQuery?.data?.data?.relatedNews;
  const oldImageListId = newsDetailQuery?.data?.data?.currentImageListIds;

  const images = newsDetailQuery?.data?.data?.images;

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
      // status: "ACTIVE",
      info: [],
      relatedNews: [],
    },
  });

  const { control, register, handleSubmit, watch } = form;

  const enContent = watch("newsContentEn");
  const cnContent = watch("newsContentCn");
  const hkContent = watch("newsContentHk");
  const jpContent = watch("newsContentJp");

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

  useEffect(() => {
    if (newsDetailQuery.isFetched) {
      setDetailQuery({
        info: newsDetailQuery?.data?.data?.info,
      });
    }
  }, [newsDetailQuery.status]);

  const onFinishHandler = async (values: any) => {
    const customResource = values?.info?.map((item: any) => {
      return {
        ...item,
        referenceCode: "ALL",
        referenceType: "NEWSROOM",
      };
    });

    const customImages = files.map(async (image: any) => {
      if (!image.imageString) {
        const resultString = await convertToBase64(image);

        return {
          path: image.path,
          name: image.name,
          imageString: resultString,
        };
      }
      return {
        path: image.filePath,
        name: image.originalFileName,
        imageString: image.imageString,
        imageKey: image.pkey,
      };
    });

    const body = {
      pkey: detail.pkey,
      newsroomCode: detail.code,
      newsTitleEn: values.newsTitleEn!,
      newsTitleCn: values?.newsTitleCn,
      newsTitleHk: values?.newsTitleHk,
      newsTitleJp: values?.newsTitleJp,
      newsContentEn: enContent,
      newsContentHk: hkContent,
      newsContentJp: jpContent,
      newsContentCn: cnContent,
      newsDate: values.newsDate,
      resourceList: customResource ?? [],
      imagePath: files.length !== 0 ? files?.[0].path : "",
      relatedNewsList: values.relatedNews,
      newsStatus: values.status,
      imagesList: await Promise.all(customImages),
      lockCounter: detail.lockCounter ?? 0,
      latestUpdateUserPkey: session?.user?.name!,
      oldImageListId: oldImageListId,
    };

    try {
      updateNewsMutation.mutate(body);
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

  if (newsDetailQuery.isFetching || newsListQuery.isFetching) {
    return (
      <div className="flex flex-row space-x-4 justify-center items-center w-full h-screen">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex w-full h-[1000px] justify-center overflow-auto relative">
      <Button
        className="bg-transparent text-[#181f25] hover:bg-transparent absolute px-8 py-4 top-8 left-0"
        onClick={() => router.push("/newsrooms")}
      >
        <BsArrowLeft className="text-white text-4xl" />
      </Button>

      <Button
        className={`${
          isEdit ? "bg-[#F54F4C]" : "bg-[#97f64d]"
        } text-[#181f25] ${
          isEdit ? "hover:bg-[#cf4340]" : "hover:bg-[#67aa34]"
        } absolute px-8 py-4 top-8 right-8`}
        onClick={() => setIsEdit(!isEdit)}
      >
        {isEdit ? "Cancel" : "Edit"}
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
          infoFields={infoFields}
          infoAppend={infoAppend}
          infoRemove={infoRemove}
          relatedNewsFields={relatedNewsFields}
          relatedNewsAppend={relatedNewsAppend}
          relatedNewsRemove={relatedNewsRemove}
          files={files}
          handleUpload={handleUpload}
          setFiles={setFiles}
          isLoading={updateNewsMutation.isLoading}
          newsList={newsList}
          newsDetail={detail}
          info={info}
          relatedNews={relatedNews}
          images={images}
          isEdit={isEdit}
          removeImages={removeImages}
          enContent={enContent}
          cnContent={cnContent}
          hkContent={hkContent}
          jpContent={jpContent}
        />
      </div>
    </div>
  );
};

export default NewsDetail;
