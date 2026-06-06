"use client";

import type { ComponentType } from "react";
import IncidentViewer from "./IncidentViewer";
import { useParams } from "next/navigation";

const TypedIncidentViewer = IncidentViewer as ComponentType<{ incidentId: string }>;

export default function Page() {
  const params = useParams<{ incidentId: string }>();
  const incidentId = params?.incidentId;

  if (!incidentId) return null;
  return <TypedIncidentViewer incidentId={incidentId} />;
}
