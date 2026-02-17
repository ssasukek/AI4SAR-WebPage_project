import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "demo1",
      data: {
        incidentName: "3 year old missing by river",
        incidentNumber: "",
        incidentDate: "2025-04-16",
      },
    },
    {
      id: "demo2",
      data: {
        incidentName: "Baltimore Harbor Rescue",
        incidentNumber: 7483,
        incidentDate: "2024-04-05",
      },
    },
    {
      id: "demo3",
      data: {
        incidentName: "Hiker overdue near trailhead",
        incidentNumber: 9102,
        incidentDate: "2026-02-10",
      },
    },
  ]);
}
