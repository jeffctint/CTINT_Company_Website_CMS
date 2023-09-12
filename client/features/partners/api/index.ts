import { UploadImageProps } from "@/types";

export const getPartnerLogo = async () => {
  let stringUrl = `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/partners/fetchAllLogos`;
  let url = new URL(stringUrl);

  const res = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return res.data;
}

export const uploadLogo = async (data: UploadImageProps) => {
  let stringUrl = `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/partners/uploadImage`;
  let url = new URL(stringUrl);


    const res = await fetch(url, {
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