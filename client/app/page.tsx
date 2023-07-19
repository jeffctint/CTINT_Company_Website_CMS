"use client";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { signIn, useSession } from "next-auth/react";

export default async function Home() {
  // server side
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   redirect("/signin");
  // }

  // console.log(session);

  // client
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  if (status === "loading") {
    return <>Loading</>;
  }

  return (
    <main className="flex h-full mx-auto flex-col justify-center items-center text-white">
      {JSON.stringify(session)}
      <button onClick={() => signIn()}>Login</button>
    </main>
  );
}
