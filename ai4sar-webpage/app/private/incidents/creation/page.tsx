"use client";
import IncidentCreation from "@/app/components/isearch/incident/IncidentCreation";
import PrivateSearcherRoute from "@/app/components/isearch/PrivateSearcherRoute";

export default function CreateIncidentPage() {
  return (
    <>
      <PrivateSearcherRoute>
        <IncidentCreation />
      </PrivateSearcherRoute>
    </>
  );
}
