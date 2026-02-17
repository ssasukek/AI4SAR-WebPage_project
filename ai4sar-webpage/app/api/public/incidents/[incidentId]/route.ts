import { NextResponse } from "next/server";

// TODO: replace with real Firestore fetch (server-side) once you have their config/service account.
export async function GET(
  _req: Request,
  { params }: { params: { incidentId: string } },
) {
  // placeholder so your UI compiles
  return NextResponse.json([
    {
      id: "demo1",
      name: "3 year old missing by river.",
      incidentNumber: "",
      incidentDate: "2025-04-16",
    },
    {
      id: "demo2",
      name: "Baltimore Harbor Rescue",
      incidentNumber: "7483",
      incidentDate: "2024-04-05",
    },
  ]);
}
