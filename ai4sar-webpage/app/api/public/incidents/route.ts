import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb.collection("incidents").get();

    const incidents = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        incidentName: data?.incidentName ?? "",
        incidentNumber: data?.incidentNumber ?? "",
        incidentDate: data?.incidentDate ?? "",
      };
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Firestore error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
