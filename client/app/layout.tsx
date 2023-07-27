"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AuthProvider from "./context/AuthProvider";
import { Inter } from "next/font/google";
import { Toaster } from "@app/components/ui/toaster";

import "./globals.css";
import QueryProvider from "./contexts/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isSigninPage = pathname.includes("/signin");

  return (
    <QueryProvider>
      <html lang="en">
        <body
          className={`${inter.className} flex flex-row font-sans h-screen overflow-hidden`}
        >
          <AuthProvider>
            {isSigninPage ? (
              <>{children}</>
            ) : (
              <>
                <Sidebar />
                <div className="bg-[#181f25] flex flex-col w-full">
                  <Topbar />

                  {children}
                </div>
              </>
            )}
            <Toaster />
          </AuthProvider>
        </body>
      </html>
    </QueryProvider>
  );
}
