import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPrivateRoute = createRouteMatcher([
  "/private(.*)",
  "/api/invite(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPrivateRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)"
    ],
};