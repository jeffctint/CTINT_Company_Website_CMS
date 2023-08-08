"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@app/components/ui/avatar";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/app/components/ui/avatarMenubar";

import { AiOutlineLogout } from "react-icons/ai";
import { signOut, useSession } from "next-auth/react";
// import useMainStore from "../store/MainStore";

const Topbar = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await fetch("http://localhost:10443/v1/login/logout", {
      method: "POST",
      mode: "cors",
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session?.user?.email,
      }),
    });
    signOut();
  };

  return (
    <div className="p-4 w-full h-[70px] bg-[#212731] flex justify-end items-center border-b-[1px] border-[#454e5f] text-white">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <div className="flex flex-row p-2 rounded-full border-[#454e5f] border-[1px] justify-between items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                {/* <AvatarFallback>CN</AvatarFallback> */}
              </Avatar>
              <span className="ml-2">
                {session && session?.user ? session.user.email : ""}
              </span>
            </div>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => handleLogout()}>
              <AiOutlineLogout />
              <span className="ml-4">Logout</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default Topbar;
