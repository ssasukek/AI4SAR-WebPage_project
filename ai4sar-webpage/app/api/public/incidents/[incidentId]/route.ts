import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ incidentId: string }> },
) {
  const adminDb = getAdminDb();
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
      incidentName: data?.incidentName || "Unknown Incident",
      incidentNumber: data?.incidentNumber || "N/A",
      incidentDate: data?.timestamp || data?.incidentDate || "No Date",
      timestamp: data?.timestamp || "",
      oesIncidentNumber: data?.oesIncidentNumber || "",
      initialRadioChannel: data?.initialRadioChannel || "",

      commandPostLocation: data?.commandPostLocation || "",
      commandPostLatitude: data?.commandPostLatitude || "",
      commandPostLongitude: data?.commandPostLongitude || "",
      commandPostTelephone: data?.commandPostTelephone || "",

      missingPersonName: data?.missingPersonName || "Unknown",
      missingPersonAge: data?.missingPersonAge || "",
      missingPersonSex: data?.missingPersonSex || "",
      missingPersonAlert: data?.missingPersonAlert || "",
      missingPersonPls: data?.missingPersonPls || "",
      missingPersonPlsLatitude: data?.missingPersonPlsLatitude || "",
      missingPersonPlsLongitude: data?.missingPersonPlsLongitude || "",
      photoURL: data?.photoURL || "",

      reportingPersonName: data?.reportingPersonName || "",
      reportingPersonAddress: data?.reportingPersonAddress || "",
      reportingPersonPhone: data?.reportingPersonPhone || "",
      sheriffName: data?.sheriffName || "",
      sheriffPhoneNumber: data?.sheriffPhoneNumber || "",

      author: data?.author || [],
      createdBy: data?.createdBy || "",
      incidentPreparedBy: data?.incidentPreparedBy || "",
      incidentDatePrepared: data?.incidentDatePrepared || "",
      incidentTimePrepared: data?.incidentTimePrepared || "",
      incidentPreparedData: data?.incidentPreparedData || "",
      submitted: data?.submitted || false,
      uid: data?.uid || "",
      // add fields here if needed
    });
  } catch (error) {
    console.error("Firestore error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
