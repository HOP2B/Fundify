import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Matcher тохиргоо
export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // Next.js дотоод файлуудыг алгасна
    "/(api|trpc)(.*)",        // API болон TRPC руу middleware ажиллуулна
  ],
};
