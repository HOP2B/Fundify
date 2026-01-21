import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internal and static files
    "/((?!_next|.*\\..*).*)",
    // Always run middleware on API routes
    "/(api|trpc)(.*)",
  ],
};
