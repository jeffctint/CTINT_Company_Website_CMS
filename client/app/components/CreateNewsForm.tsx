"use client";
import { useRef } from "react";
import { CreateNewsFormProps, NewsProps } from "@/types";
import TextEditor from "@app/components/TextEditor";
import { MdOutlineDateRange } from "react-icons/md";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";

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
import { RiDeleteBinLine } from "react-icons/ri";
import { Card } from "@app/components/ui/card";

const getNewsList = async () => {
  const res = await fetch("http://localhost:10443/v1/newsrooms", {
    method: "POST",
    mode: "cors",
    cache: "force-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return res;
};

const CreateNewsForm = ({
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
  isLoading,
  removeImages,
  handleSaveAsDraft,
}: CreateNewsFormProps) => {
  const openRef = useRef<() => void>(null);

  const newsListQuery = useQuery({
    queryKey: ["list"],
    queryFn: async () => await getNewsList(),
    cacheTime: 100,
  });

  const newsList = newsListQuery?.data?.data?.newsContent;

  const previews = files.map((file: any, index: number) => {
    const imageUrl = URL.createObjectURL(file);

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

  console.log("files", files);

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
              News Title EN
            </TabsTrigger>
            <TabsTrigger value="newsTitleCn">News Title CN</TabsTrigger>
            <TabsTrigger value="newsTitleHk">News Title HK</TabsTrigger>
            <TabsTrigger value="newsTitleJp">News Title JP</TabsTrigger>
          </TabsList>
          <TabsContent value="newsTitleEn">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsTitleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">
                      News Title EN
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="text-white bg-transparent border-[#454e5f] border-b-[1px] !outline-none placeholder:bg-transparent"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </TabsContent>
          <TabsContent value="newsTitleCn">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsTitleCn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">
                      News Title CN
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="text-white bg-transparent border-[#454e5f] border-b-[1px] !outline-none placeholder:bg-transparent"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </TabsContent>
          <TabsContent value="newsTitleHk">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsTitleHk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">
                      News Title HK
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="text-white bg-transparent border-[#454e5f] border-b-[1px] !outline-none placeholder:bg-transparent"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </TabsContent>
          <TabsContent value="newsTitleJp">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsTitleJp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">
                      News Title JP
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="text-white bg-transparent border-[#454e5f] border-b-[1px] !outline-none placeholder:bg-transparent"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </TabsContent>
        </Tabs>
        {/* Content Tab */}
        <Tabs defaultValue="newsContentEn" className="w-full">
          <TabsList className="grid w-full h-full grid-cols-2 xl:grid-cols-4">
            <TabsTrigger
              // className="data-[state=active]:bg-red-300"
              value="newsContentEn"
            >
              News Content EN
            </TabsTrigger>
            <TabsTrigger value="newsContentCn">News Content CN</TabsTrigger>
            <TabsTrigger value="newsContentHk">News Content HK</TabsTrigger>
            <TabsTrigger value="newsContentJp">News Content JP</TabsTrigger>
          </TabsList>
          <TabsContent value="newsContentEn">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsContentEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">
                      News Content EN
                    </FormLabel>
                    <FormControl>
                      <TextEditor
                        onChange={field.onChange}
                        content={field.value}
                        className="w-3/5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </TabsContent>
          <TabsContent value="newsContentCn">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsContentCn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">
                      News Content Cn
                    </FormLabel>
                    <FormControl>
                      <TextEditor
                        onChange={field.onChange}
                        content={field.value}
                        className="w-3/5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </TabsContent>
          <TabsContent value="newsContentHk">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsContentHk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">
                      News Content HK
                    </FormLabel>
                    <FormControl>
                      <TextEditor
                        onChange={field.onChange}
                        content={field.value}
                        className="w-3/5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </TabsContent>
          <TabsContent value="newsContentJp">
            <Card className="bg-transparent border-0">
              <FormField
                control={form.control}
                name="newsContentJp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#a9b3c6]">
                      News Content JP
                    </FormLabel>
                    <FormControl>
                      <TextEditor
                        onChange={field.onChange}
                        content={field.value}
                        className="w-3/5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="newsDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-[#a9b3c6]">News Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={"outline"}>
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
            mt={previews.length > 0 ? "xl" : 0}
          >
            {previews.map((img: any, i: number) => (
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-white bg-transparent border-[#454e5f]">
                    <SelectValue placeholder="News Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem id="label">
          <FormLabel className="flex flex-row justify-between items-center">
            <div className="text-[#a9b3c6]">More Infomation</div>
            <Button
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
                          <Input {...register(`info.${index}.name`)} />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="text-[#a9b3c6]">
                          Website
                        </FormLabel>
                        <FormControl>
                          <Input {...register(`info.${index}.website`)} />
                        </FormControl>
                      </FormItem>
                      <Button
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
                            <SelectTrigger className="text-white bg-transparent border-[#454e5f] w-80">
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
                      </FormItem>

                      <Button
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

        <div className="flex flex-row w-full space-x-4">
          <Button
            disabled={isLoading}
            type="submit"
            className="w-2/3 flex-1 bg-[#97f64d] text-[#181f25] hover:bg-[#97f64d] my-10"
          >
            {isLoading ? "Loading" : "Submit"}
          </Button>
          <Button
            onClick={handleSubmit(handleSaveAsDraft)}
            disabled={isLoading}
            type="button"
            className="w-1/3 bg-[#e8ffd6] text-[#181f25] hover:bg-[#e8ffd6] my-10"
          >
            {isLoading ? "Loading" : "Save Draft"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateNewsForm;
