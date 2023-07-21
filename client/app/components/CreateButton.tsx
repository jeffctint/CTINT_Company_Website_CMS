"use client";

import { Button } from "@app/components/ui/button";
import { useRouter } from "next/navigation";

const CreateButton = ({ pathname }: any) => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(pathname)}
      className="text-[#181f25] bg-[#97f64d] hover:bg-[#71b93a]"
    >
      Create
    </Button>
  );
};

export default CreateButton;
