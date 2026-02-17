import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: replace with real Firestore fetch (server-side) once you have their config/service account.
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ incidentId: string }> },
) {
  const { incidentId } = await context.params;
  // placeholder so your UI compiles
  const demo: Record<string, any> = {
    demo1: {
      id: "demo1",
      data: {
        incidentName: "3 year old missing by river.",
        incidentNumber: "",
        incidentDate: "2025-04-16",
      },
      subject: {},
      clues: {},
    },
  };

  const item = demo[incidentId];
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}
