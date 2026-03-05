import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { pageId, content } = body; // ex. pageId = "teams"

    // 3. Save it to a new 'website_content' collection in Firestore
    const adminDb = getAdminDb();
    await adminDb.collection("website_content").doc(pageId).set(
      {
        content,
        lastUpdatedBy: userId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId");

    if (!pageId)
      return NextResponse.json({ error: "Missing pageId" }, { status: 400 });

    const adminDb = getAdminDb();
    const doc = await adminDb.collection("website_content").doc(pageId).get();

    if (!doc.exists) {
      return NextResponse.json({ content: "" });
    }

    return NextResponse.json(doc.data());
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
