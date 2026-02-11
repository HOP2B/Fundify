import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// New style config for Next.js 16+
export const config = {
  // "matcher" stays the same, just syntax clarification
  matcher: [
    "/((?!_next|.*\\..*).*)", // Skip Next.js internals
    "/(api|trpc)(.*)",        // Run middleware on API and trpc
  ],
};
