import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
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
