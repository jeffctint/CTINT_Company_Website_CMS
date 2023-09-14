"use client"

import { Separator } from "@app/components/ui/separator"
import { useEffect, useRef, useState } from "react";

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
import { UploadImageProps } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { partnersKeys } from "@/features/queries";
import { getPartnerLogo, updateLogo, uploadLogo } from "@/features/partners/api";
import Loading from "./loading";

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


const Partners = () => {
  const openRef = useRef<() => void>(null);
  const router = useRouter();

  const [files, setFiles] = useState<FileWithPath[]>([]); //upload images
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const queryClient = useQueryClient();

  const createUploadLogoMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: (res) => {
      queryClient.invalidateQueries(partnersKeys.list());
      if (res.errMsg === "" && res.isSuccess) {
        router.push("/partners");
      }
    },
  });

  const updateLogoMutation = useMutation({
    mutationFn: updateLogo,
    onSuccess: (res) => {
      queryClient.invalidateQueries(partnersKeys.list());
      if (res.errMsg === "" && res.isSuccess) {
        router.push("/partners");
      }
    },
  });

  const partnerLogoQuery = useQuery({
    queryKey: partnersKeys.lists(),
    queryFn: async () => await getPartnerLogo(),
    cacheTime: 1000,
  });


  const logos = partnerLogoQuery?.data?.data
  const currentImageLists = partnerLogoQuery?.data?.currentImageListIds
  console.log("partnerLogoQuery", partnerLogoQuery)
  console.log('logos', logos)

  const handleUpload = (data: any) => {
    setFiles([...files, ...data]);
  };

  const removeImages = (index: number) => {
    setFiles(files.filter((item: any, i: number) => i !== index));
  };

  const previews = files?.map((file: any, index: number) => {
    if (logos.length === 0) {
      const imageUrl = URL?.createObjectURL(file);

      return (
        <Image
          width={"100%"}
          height={120}
          fit="contain"
          key={index}
          src={imageUrl}
          imageProps={{ onLoad: () => URL?.revokeObjectURL(imageUrl) }}
        />
      );
    }

  });

  const handleUploadLogo = async () => {
    const customImages = files.map(async (image: any, i: number) => {
      console.log("image", image)
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
      imagesList: await Promise.all(customImages),
    }

    try {
      console.log(body)
      createUploadLogoMutation.mutate(body)
    } catch (err: any) {
      console.error(err)
    }
  }

  const handleUpdateLogo = async () => {
    const customImages = files.map(async (image: any, i: number) => {
      if (!image.imageString) {
        const resultString = await convertToBase64(image);

        return {
          path: image.path,
          name: image.name,
          imageString: resultString,
          position: i
        };
      }
      return {
        path: image.filePath,
        name: image.originalFileName,
        imageString: image.imageString,
        imageKey: image.imageKey,
        position: i
      };
    });

    const body = {
      imagesList: await Promise.all(customImages),
      oldImageListId: currentImageLists
    }

    try {
      updateLogoMutation.mutate(body)
    } catch (err: any) {
      console.error(err)
    }
  }

  const fetchedPreviews = files?.map((item: any, index: number) => {
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
          height={120}
          fit="contain"
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
        height={120}
        fit="contain"
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });



  useEffect(() => {
    setFiles(logos)

  }, [logos])

  if (partnerLogoQuery.isFetching) {
    return <Loading />
  }

  console.log("files", files)
  return (
    <div className="flex justify-center  text-white text-2xl p-4">
      <div className="flex flex-row w-full max-h-fit">
        <div className="flex flex-row space-x-4 items-center">
          <div className="break-normal">Parntership Logo</div>
          <Separator orientation="vertical" />
        </div>
        <div className="w-1/2 flex flex-col justify-start p-4 min-h-[300px]">
          <div className="flex flex-col space-y-8">
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
            {logos?.length === 0 ?
              <SimpleGrid
                cols={4}
                breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                mt={fetchedPreviews?.length > 0 ? "xl" : 0}>
                {previews?.map((img: any, i: number) => (
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
              :
              <SimpleGrid
                cols={4}
                breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                mt={fetchedPreviews?.length > 0 ? "xl" : 0}
              >
                {fetchedPreviews?.map((img: any, i: number) => (
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
            }
          </div>
          {logos?.length === 0 ? <Button
            onClick={handleUploadLogo}
            disabled={isLoading}
            type="button"
            className={`w-full ${files?.length > 0 ? "block" : "hidden"} flex-1 bg-[#97f64d] text-[#181f25] hover:bg-[#97f64d] my-10 transition`}
          >
            {isLoading ? "Loading" : "Upload"}
          </Button> : <Button
            onClick={handleUpdateLogo}
            disabled={isLoading}
            type="button"
            className={`w-full flex-1 bg-[#97f64d] text-[#181f25] hover:bg-[#97f64d] my-10 transition`}
          >
            {isLoading ? "Loading" : "Update"}
          </Button>}
        </div>
      </div>

    </div>
  );
};

export default Partners;
