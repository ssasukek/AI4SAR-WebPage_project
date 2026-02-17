"use client";

import IncidentViewer from "./IncidentViewer";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ incidentId: string }>();
  const incidentId = params?.incidentId;

  if (!incidentId) return null;
  return <IncidentViewer incidentId={incidentId} />;
}
