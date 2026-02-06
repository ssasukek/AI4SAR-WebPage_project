import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher([
  "/private(.*)",
  "/api/invite(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/public/login(.*)",
  "/public/register(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/private/admin(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPrivateRoute(req)) {
    await auth.protect();
  }

  if (isPublicRoute(req)){
    return NextResponse.next();
  }

  // for sign in user
  const { userId } = await auth();
  if (!userId) return NextResponse.redirect(new URL("/public/login", req.url));

  // admin 
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();
    const role = (sessionClaims as any)?.publicMetadata?.role;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)"
    ],
};