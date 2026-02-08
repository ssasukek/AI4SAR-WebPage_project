"use client";

import IncidentEdit from "../../../../components/incident/IncidentEdit";
import PrivateSearcherRoute from "../../../../components/PrivateSearcherRoute";

export default function EditIncidentPage() {
  return (
    <>
      <PrivateSearcherRoute>
        <IncidentEdit initialIncidentState={undefined} />
      </PrivateSearcherRoute>
    </>
  );
}
