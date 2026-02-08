"use client";
import SavedOrSubmittedForm from "../../../../components/forms/SavedOrSubmittedForm";
import PrivateSearcherRoute from "../../../../components/PrivateSearcherRoute";
import { useParams } from "next/navigation";
import { getFormsList } from "../../../../components/forms/Form";
import Form from "../../../../components/forms/Form";

// formId or key
export default function IncidentFormPage() {
  const { formId } = useParams();
  const forms = getFormsList();
  const foundKey = forms.find((form) => form.key === formId);

  // if you didn't find the key, then it must be :formId
  // it will search for the saved or submitted form of the slug
  if (!foundKey) {
    return (
      <PrivateSearcherRoute>
        <SavedOrSubmittedForm />
      </PrivateSearcherRoute>
    )
  };

  // otherwise it would be :key
  // it will access the specific SAR form from the forms list
  return (
    <PrivateSearcherRoute>
      <Form name={formId} initialFormState={undefined} photoURL={undefined} />
    </PrivateSearcherRoute>
  );
}
