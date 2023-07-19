"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AiOutlineClose,
  AiOutlineDashboard,
  AiOutlineUserSwitch,
} from "react-icons/ai";

import {
  PiQuotesBold,
  PiHandshake,
  PiNewspaperClippingBold,
} from "react-icons/pi";
import { MdWorkOutline } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "dashboard",
    title: "Dashboard",
    path: "/",
    icon: <AiOutlineDashboard />,
  },
  {
    name: "users",
    title: "User Manager",
    path: "/users",
    icon: <AiOutlineUserSwitch />,
  },
  {
    name: "quotes",
    title: "Quotes",
    path: "/quotes",
    icon: <PiQuotesBold />,
  },
  {
    name: "jobs",
    title: "Jobs",
    path: "/jobs",
    icon: <MdWorkOutline />,
  },
  {
    name: "partners",
    title: "Partners",
    path: "/partners",
    icon: <PiHandshake />,
  },
  {
    name: "newsrooms",
    title: "Newsrooms",
    path: "/newsrooms",
    icon: <PiNewspaperClippingBold />,
  },
];

const activeLink =
  "flex flex-row items-center gap-5 rounded-lg p-4 text-[#454e5f] bg-[#97f64d]";

const normalLink =
  "flex flex-row items-center gap-5 rounded-lg p-4 text-[#a9b3c6] hover:bg-[#333a47]";

const Sidebar = () => {
  // const { pathname } = useStateContext();
  // console.log(pathname);

  const pathname = usePathname();
  const activeMenu = true;
  return (
    <div className="bg-[#212731] min-w-[236px] p-4 h-screen flex flex-col overflow-hidden  border-r-[1px] border-[#454e5f]">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center w-full">
            <Link href={"/"} className="flex gap-3 items-center">
              <Image
                src="/images/logo.png"
                width="120"
                height="36"
                alt={"Continuous Technologies International Ltd"}
              />
            </Link>

            {/* <button className="p-2 rounded-full hover:bg-gray-300 ">
              <AiOutlineClose className="text-white hover:text-black" />
            </button> */}
          </div>
          <div className="mt-10 inline-block">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={
                  pathname.includes(link.name) ? activeLink : normalLink
                }
              >
                {link.icon}
                <span className="ml-3 inline-block">{link.title}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
