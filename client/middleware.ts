// // export { default } from "next-auth/middleware"

// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const pathname = req.nextUrl.pathname;
//   const protectedPaths = [
//     "/",
//     "/users",
//     "/quotes",
//     "/jobs",
//     "/partners",
//     "/newsrooms",
//     "/newsrooms/:path*",
//   ];
//   const isPathProtected = protectedPaths?.some((path) => pathname === path);
//   // const res = NextResponse.next();
//   if (isPathProtected) {
//     console.log("isPathProtected", isPathProtected);
//     const token = await getToken({ req });
//     if (!token) {
//       const url = new URL(`/signin`, req.url);
//       url.searchParams.set("callbackUrl", pathname);
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
//   // return res;
// }

// export const config = {
//     matcher: ["/users/:path*"],
//   }

export { default } from "next-auth/middleware";
export const config = {
  matcher: [
    "/",
    "/users",
    "/quotes",
    "/jobs",
    "/partners",
    "/newsrooms",
    "/newsrooms/:path*",
  ],
};
