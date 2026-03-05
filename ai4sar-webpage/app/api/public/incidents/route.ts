import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminDb = getAdminDb();
    const snapshot = await adminDb.collection("incidents").get();

    const incidents = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        incidentName: data?.incidentName || "Unknown Incident",
        incidentNumber: data?.incidentNumber || "N/A",
        incidentDate: data?.timestamp || data?.incidentDate || "No Date",
      };
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Firestore error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
