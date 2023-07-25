"use client";
import { useRef } from "react";
import { CreateNewsFormProps } from "@/types";
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
  Group,
  Image,
  Text as MText,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

const CreateNewsForm = ({
  type,
  handleSubmit,
  onFinishHandler,
  form,
  control,
  register,
  fields,
  append,
  remove,
  files,
  handleUpload,
}: CreateNewsFormProps) => {
  const openRef = useRef<() => void>(null);

  const previews = files.map((file: any, index: number) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        width={"100%"}
        height={80}
        fit="contain"
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
        <FormField
          control={form.control}
          name="newsTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#a9b3c6]">News Title</FormLabel>
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
        <FormField
          control={form.control}
          name="newsContentEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#a9b3c6]">News Content EN</FormLabel>
              <FormControl>
                <TextEditor
                  onChange={field.onChange}
                  content={field.value}
                  className="w-3/5"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newsContentHk"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#a9b3c6]">News Content HK</FormLabel>
              <FormControl>
                <TextEditor onChange={field.onChange} content={field.value} />
              </FormControl>
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
              <div key={i} className="w-full">
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
                    <SelectValue placeholder="Select a verified email to display" />
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
                console.log("append", append());
                append({ name: "", website: "" });
              }}
              className="bg-transparent border-[#97f64d] border-[1px] text-[#97f64d]"
            >
              Add Infomation
            </Button>
          </FormLabel>
          <ul>
            {fields.map((item: any, index: number) => {
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
                        onClick={() => remove(index)}
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

        <Button
          type="submit"
          className="w-full bg-[#97f64d] text-[#181f25] hover:bg-[#97f64d] my-10"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CreateNewsForm;
