"use client";

import IncidentsList from "@/app/components/isearch/incident/IncidentsList";
import PrivateSearcherRoute from "@/app/components/isearch/PrivateSearcherRoute";

export default function Page() {
  return (
    <PrivateSearcherRoute>
      <IncidentsList />
    </PrivateSearcherRoute>
  );
}
