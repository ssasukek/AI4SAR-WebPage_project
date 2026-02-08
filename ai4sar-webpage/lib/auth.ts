import { auth } from "@clerk/nextjs/server";

export async function isSignedIn() {
  const { userId } = await auth();
  return !!userId;
}
