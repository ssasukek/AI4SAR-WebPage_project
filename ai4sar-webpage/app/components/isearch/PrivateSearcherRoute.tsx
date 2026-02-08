"use client";
import React, { useEffect } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function PrivateSearcherRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>{children}</SignedIn>
    </>
  );
}