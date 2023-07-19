"use client";

import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "../components/LoginForm";

const Signin: NextPage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false,
    });

    if (res?.url) {
      router.push("/");
    }
  };
  return (
    <div className="bg-[#181f25] flex flex-row items-center justify-end w-full">
      <div className="flex flex-col w-1/2 p-40 h-screen justify-center items-center">
        <h1 className=" text-4xl text-[#97f64d] font-bold mb-16">
          CTINT Website CMS
        </h1>

        <LoginForm />
      </div>
    </div>
  );
};

export default Signin;
