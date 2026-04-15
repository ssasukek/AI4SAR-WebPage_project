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
    if (!me || !me.emailAddresses || me.emailAddresses.length === 0) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const targetEmail = body?.email?.toLowerCase().trim();

    if (!targetEmail) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      console.error("Missing NEXT_PUBLIC_APP_URL in Vercel Env Vars");
      return NextResponse.json(
        { error: "Server URL configuration error" },
        { status: 500 },
      );
    }

    const client = await clerkClient();
    const invite = await client.invitations.createInvitation({
      emailAddress: targetEmail,
      ignoreExisting: true,
      redirectUrl: `${baseUrl}/public/login`,
    });

    return NextResponse.json({ ok: true, invite });

  } catch (err: any) {
    console.error("INVITE ERROR:", err);
    const clerkError = err?.errors?.[0]?.longMessage;
    return NextResponse.json(
      { error: clerkError || err?.message || "Server error" },
      { status: err?.status || 500 },
    );
  }
}
