"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="auth-page">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#1f2933",
            borderRadius: "10px",
            fontFamily: "system-ui",
          },
          elements: {
            card: "shadow-lg",
          },
        }}
      />
      ;
    </div>
  );
}
