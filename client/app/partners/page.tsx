"use client"

import LoadingComponent from "../components/LoadingComponent";
import { Separator } from "@app/components/ui/separator"
import { useRef, useState } from "react";

import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Button } from "@/app/components/ui/button";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import {
  Group,
  Image,
  Text as MText,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import { RiDeleteBinLine } from "react-icons/ri";


const Partners = () => {
  const openRef = useRef<() => void>(null);
  const [files, setFiles] = useState<FileWithPath[]>([]); //upload images
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleUpload = (data: any) => {
    setFiles([...files, ...data]);
  };

  const removeImages = (index: number) => {
    setFiles(files.filter((item, i) => i !== index));
  };

  const previews = files.map((file: any, index: number) => {
    const imageUrl = URL.createObjectURL(file);

    return (
      <Image
        width={"100%"}
        height={120}
        fit="cover"
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  return (
    <div className="flex justify-center  text-white text-2xl p-4">
      <div className="flex flex-row w-full max-h-fit">
        <div className="flex flex-row space-x-4 items-center">
          <div className="break-normal">Parntership Logo</div>
          <Separator orientation="vertical" />
        </div>
        <div className="w-1/2 flex flex-col justify-start p-4 min-h-[300px]">
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
                    className="absolute right-1 top-1 flex items-center justify-center w-6 h-6 rounded-full hover:bg-[#a9b3c6] z-10 cursor-pointer"
                  >
                    <RiDeleteBinLine className="text-[#ffffff] w-4 h-4" />
                  </span>
                  {img}
                </div>
              ))}
            </SimpleGrid>
          </div>
          <Button
            // onClick={handleSubmit(handleSaveAsDraft)}
            disabled={isLoading}
            type="button"
            className={`w-full ${files.length > 0 ? "block" : "hidden"} flex-1 bg-[#97f64d] text-[#181f25] hover:bg-[#97f64d] my-10 transition`}
          >
            {isLoading ? "Loading" : "Upload"}
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Partners;
