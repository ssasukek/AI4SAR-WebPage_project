import "bootstrap/dist/css/bootstrap.min.css";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function PrivateLayout({
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
