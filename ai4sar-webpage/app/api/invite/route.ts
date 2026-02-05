import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export const runtime = "nodejs";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export async function POST(req: Request) {
  try {
    const me = await currentUser();
    if (!me)
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const client = await clerkClient();

    const invite = await client.invitations.createInvitation({
      emailAddress: email,
      ignoreExisting: true,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/public/login`
    });

    return NextResponse.json({ ok: true, invite });
  } catch (err: any) {
    console.error("INVITE ERROR:", err);
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 },
    );
  }
}
