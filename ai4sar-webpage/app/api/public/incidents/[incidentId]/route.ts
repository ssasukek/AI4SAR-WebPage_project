import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ incidentId: string }> },
) {
  const { incidentId } = await context.params;
  try {
    const docRef = adminDb.collection("incidents").doc(incidentId);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = snap.data();

    // Return only fields for public viewer
    return NextResponse.json({
      id: snap.id,
      incidentName: data?.incidentName ?? "",
      incidentNumber: data?.incidentNumber ?? "",
      incidentDate: data?.incidentDate ?? "",
      // add fields here if needed
    });
  } catch (error) {
    console.error("Firestore error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
