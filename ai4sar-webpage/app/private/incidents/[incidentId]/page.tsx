"use client";
import Incident from "@/app/components/isearch/incident/Incident";
import PrivateSearcherRoute from "@/app/components/isearch/PrivateSearcherRoute";

export default function IncidentPage() {
  return (
    <>
      <PrivateSearcherRoute>
        <Incident />
      </PrivateSearcherRoute>
    </>
  );
}
