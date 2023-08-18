"use client";
import { useEffect, useRef } from "react";
import { CreateNewsFormProps, NewsDetailFormProps, NewsProps } from "@/types";
import TextEditor from "@app/components/TextEditor";
import { MdOutlineDateRange } from "react-icons/md";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import parse from "html-react-parser";
import { RiDeleteBinLine } from "react-icons/ri";

import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { Calendar } from "@app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@app/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@app/components/ui/tabs";
import { Card } from "@app/components/ui/card";
import {
  Group,
  Image,
  Text as MText,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useQuery } from "@tanstack/react-query";

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


const NewsDetailForm = ({
  handleSubmit,
  onFinishHandler,
  form,
  register,
  infoFields,
  infoAppend,
  infoRemove,
  relatedNewsFields,
  relatedNewsAppend,
  relatedNewsRemove,
  files,
  handleUpload,
  setFiles,
  isLoading,
  newsDetail,
  newsList,
  isEdit,
  info,
  relatedNews,
  images,
  removeImages,
  enContent,
  cnContent,
  hkContent,
  jpContent,
}: NewsDetailFormProps) => {
  const openRef = useRef<() => void>(null);


  useEffect(() => {
    form.setValue("newsTitleEn", newsDetail?.newsTitleEn);
    form.setValue("newsTitleHk", newsDetail?.newsTitleHk);
    form.setValue("newsTitleCn", newsDetail?.newsTitleCn);
    form.setValue("newsTitleJp", newsDetail?.newsTitleJp);

    form.setValue("newsContentEn", newsDetail?.newsContentEn ?? "");
    form.setValue("newsContentHk", newsDetail?.newsContentHk ?? "");
    form.setValue("newsContentCn", newsDetail?.newsContentCn ?? "");
    form.setValue("newsContentJp", newsDetail?.newsContentJp ?? "");

    form.setValue("newsDate", new Date(newsDetail?.newsDate));
    form.setValue("status", newsDetail?.status);

    if (info) {
      form.setValue("info", info); // very important
    }
    if (relatedNews) {
      form.setValue("relatedNews", relatedNews); // very important
    }
  }, [newsDetail, info]);

  useEffect(() => {
    if (images) {
      setFiles(images);
    }
  }, [images]);

  const fetchedPreviews = files.map((item: any, index: number) => {
    // Convert base64 string to ArrayBuffer
    const base64ToArrayBuffer = (base64: string) => {
      // Prepend window.atob to avoid the deprecated warning
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return bytes.buffer;
    };

    if (!item.imageString) {
      const imageUrl = URL.createObjectURL(item);

      return (
        <Image
          width={"100%"}
          height={80}
          fit="cover"
          key={index}
          src={imageUrl}
          imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        />
      );
    }

    const buffer = base64ToArrayBuffer(item.imageString.split(",")[1]);
    const blob = new Blob([buffer], { type: item.MimeType });
    const imageUrl = URL.createObjectURL(blob);

    return (
      <Image
        width={"100%"}
        height={80}
        fit="cover"
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onFinishHandler)}
        className="w-full space-y-8 pb-8"
      >
        {/* Title Tab */}
        <Tabs defaultValue="newsTitleEn" className="w-full">
          <TabsList className="grid w-full h-full grid-cols-2 xl:grid-cols-4">
            <TabsTrigger
              // className="data-[state=active]:bg-red-300"
              value="newsTitleEn"
            >
              English
            </TabsTrigger>
            <TabsTrigger value="newsTitleCn">Simplified Chinese</TabsTrigger>
            <TabsTrigger value="newsTitleHk">Traditional Chinese</TabsTrigger>
            <TabsTrigger value="newsTitleJp">Japanese</TabsTrigger>
          </TabsList>
          <TabsContent value="newsTitleEn">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsTitleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEdit}
                        value={field.value}
                        onChange={field.onChange}
                        className="text-white bg-transparent border-[#454e5f] border-b-[1px] !outline-none placeholder:bg-transparent"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEdit ? (
                <div className="flex flex-col w-full mt-2">
                  <div className="text-[#a9b3c6] pb-2 text-sm">Content</div>
                  <p
                    className="text-white"
                    dangerouslySetInnerHTML={{
                      __html: newsDetail?.newsContentEn,
                    }}
                  ></p>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="newsContentEn"
                  render={({ field }) => (
                    <FormItem className="my-1">
                      <FormLabel className="text-[#a9b3c6] ">Content</FormLabel>
                      <FormControl>
                        <TextEditor
                          onChange={field.onChange}
                          content={field.value}
                          className="w-3/5"
                          initialContent={enContent}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="newsTitleCn">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsTitleCn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEdit}
                        value={field.value}
                        onChange={field.onChange}
                        className="text-white bg-transparent border-[#454e5f] border-b-[1px] !outline-none placeholder:bg-transparent"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEdit ? (
                <div className="flex flex-col w-full mt-2">
                  <div className="text-[#a9b3c6] pb-2 text-sm">Content</div>
                  <p
                    className="text-white"
                    dangerouslySetInnerHTML={{
                      __html: newsDetail?.newsContentCn,
                    }}
                  ></p>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="newsContentCn"
                  render={({ field }) => (
                    <FormItem className="my-1">
                      <FormLabel className="text-[#a9b3c6]">Content</FormLabel>
                      <FormControl>
                        <TextEditor
                          onChange={field.onChange}
                          content={field.value}
                          className="w-3/5"
                          initialContent={cnContent}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="newsTitleHk">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsTitleHk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEdit}
                        value={field.value}
                        onChange={field.onChange}
                        className="text-white bg-transparent border-[#454e5f] border-b-[1px] !outline-none placeholder:bg-transparent"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEdit ? (
                <div className="flex flex-col w-full mt-2">
                  <div className="text-[#a9b3c6] pb-2 text-sm">Content</div>
                  <p
                    className="text-white"
                    dangerouslySetInnerHTML={{
                      __html: newsDetail?.newsContentHk,
                    }}
                  ></p>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="newsContentHk"
                  render={({ field }) => (
                    <FormItem className="my-1">
                      <FormLabel className="text-[#a9b3c6]">Content</FormLabel>
                      <FormControl>
                        <TextEditor
                          onChange={field.onChange}
                          content={field.value}
                          className="w-3/5"
                          initialContent={hkContent}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="newsTitleJp">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsTitleJp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEdit}
                        value={field.value}
                        onChange={field.onChange}
                        className="text-white bg-transparent border-[#454e5f] border-b-[1px] !outline-none placeholder:bg-transparent"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEdit ? (
                <div className="flex flex-col w-full mt-2">
                  <div className="text-[#a9b3c6] pb-2 text-sm">Content</div>
                  <p
                    className="text-white"
                    dangerouslySetInnerHTML={{
                      __html: newsDetail?.newsContentJp,
                    }}
                  ></p>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="newsContentJp"
                  render={({ field }) => (
                    <FormItem className="my-1">
                      <FormLabel className="text-[#a9b3c6]">Content</FormLabel>
                      <FormControl>
                        <TextEditor
                          onChange={field.onChange}
                          content={field.value}
                          className="w-3/5"
                          initialContent={jpContent}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </Card>
          </TabsContent>
        </Tabs>

        <FormItem id="label">
          <FormLabel className="flex flex-row justify-between items-center">
            <div className="text-[#a9b3c6]">More Infomation</div>
            <Button
              disabled={!isEdit}
              type="button"
              onClick={() => {
                infoAppend({ name: "", website: "" });
              }}
              className="bg-transparent border-[#97f64d] border-[1px] text-[#97f64d]"
            >
              Add Infomation
            </Button>
          </FormLabel>
          <ul>
            {infoFields.map((item: any, index: number) => {
              return (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`info.${index}`}
                  render={() => (
                    <li className="flex flex-row space-x-3 justify-between items-end py-4 2xl:w-3/5">
                      <FormItem>
                        <FormLabel className="text-[#a9b3c6]">
                          information
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...register(`info.${index}.name`)}
                            disabled={!isEdit}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <FormItem>
                        <FormLabel className="text-[#a9b3c6]">
                          Website
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...register(`info.${index}.website`)}
                            disabled={!isEdit}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <Button
                        disabled={!isEdit}
                        type="button"
                        className="bg-[#97f64d] text-[#181f25] hover:bg-[#97f64d]"
                        onClick={() => infoRemove(index)}
                      >
                        Delete
                      </Button>
                    </li>
                  )}
                />
              );
            })}
          </ul>
        </FormItem>

        <FormItem id="relatedNews">
          <FormLabel className="flex flex-row justify-between items-center">
            <div className="text-[#a9b3c6]">Related News</div>
            <Button
              type="button"
              disabled={!isEdit}
              onClick={() => {
                relatedNewsAppend({ referenceCode: "" });
              }}
              className="bg-transparent border-[#97f64d] border-[1px] text-[#97f64d]"
            >
              Add News
            </Button>
          </FormLabel>
          <ul>
            {relatedNewsFields.map((item: any, index: number) => {
              return (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`relatedNews.${index}.referenceCode`}
                  render={({ field }) => (
                    <li className="flex flex-row space-x-3 justify-between items-end py-4 2xl:w-3/5">
                      <FormItem>
                        <FormLabel className="text-[#a9b3c6]">Code</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              disabled={!isEdit}
                              className="text-white bg-transparent border-[#454e5f] w-80"
                            >
                              <SelectValue placeholder="Select related news" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="h-72">
                            {newsList?.map((news: NewsProps) => (
                              <SelectItem key={news.code} value={news.code}>
                                {news.newsTitleEn}
                                {"  |  "}
                                {dayjs(news.newsDate).format("YYYY/MM/DD")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>

                      <Button
                        disabled={!isEdit}
                        className="bg-[#97f64d] text-[#181f25] hover:bg-[#97f64d]"
                        onClick={() => relatedNewsRemove(index)}
                      >
                        Delete
                      </Button>
                    </li>
                  )}
                />
              );
            })}
          </ul>
        </FormItem>

        <FormField
          control={form.control}
          name="newsDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-[#a9b3c6]">News Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      disabled={!isEdit}
                    >
                      {field.value ? (
                        dayjs(field.value).format("DD/MMM/YYYY")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <MdOutlineDateRange className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Dropzone
            openRef={openRef}
            onDrop={handleUpload}
            radius="md"
            accept={IMAGE_MIME_TYPE}
            maxSize={10 * 1024 ** 2}
            multiple={true}
            disabled={!isEdit}
            className={`${
              isEdit ? `` : `bg-[#a9b3c6] cursor-not-allowed hover:bg-[#a9b3c6]`
            }`}
          >
            <div style={{ pointerEvents: "none" }}>
              <Group position="center">
                <Dropzone.Accept>
                  <IconDownload size={rem(50)} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={rem(50)} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconCloudUpload size={rem(50)} stroke={1.5} />
                </Dropzone.Idle>
              </Group>

              <MText ta="center" fw={700} fz="lg" mt="xl">
                <Dropzone.Accept>Drop files here</Dropzone.Accept>
                <Dropzone.Reject>Image file less than 10mb</Dropzone.Reject>
                <Dropzone.Idle>Upload Images</Dropzone.Idle>
              </MText>
              <Text ta="center" fz="sm" mt="xs" c="dimmed">
                Drag&apos;n&apos;drop files here to upload. We can accept only
                images files that are less than 10mb in size.
              </Text>
            </div>
          </Dropzone>

          <SimpleGrid
            cols={4}
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
            mt={fetchedPreviews.length > 0 ? "xl" : 0}
          >
            {fetchedPreviews.map((img: any, i: number) => (
              <div key={i} className="w-full relative">
                <span
                  onClick={() => removeImages(i)}
                  className="absolute right-0 top-1 flex items-center justify-center w-6 h-6 rounded-full  hover:bg-[#a9b3c6] z-10 cursor-pointer"
                >
                  <RiDeleteBinLine className="text-[#ffffff]" />
                </span>
                {img}
              </div>
            ))}
          </SimpleGrid>
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#a9b3c6]">Status</FormLabel>
              <Select
                value={field.value || newsDetail?.status}
                onValueChange={field.onChange || newsDetail?.status}
                disabled={!isEdit}
              >
                <FormControl>
                  <SelectTrigger className="text-white bg-transparent border-[#454e5f]">
                    <SelectValue placeholder={newsDetail?.status} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  <SelectItem disabled value="DRAFT">
                    DRAFT
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEdit ? (
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-[#97f64d] text-[#181f25] hover:bg-[#97f64d] my-10"
          >
            {isLoading ? "Loading" : "Submit"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default NewsDetailForm;
