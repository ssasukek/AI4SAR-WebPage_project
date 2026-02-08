"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase-config";
import Form from "./Form";
import { GenericForm } from "./Form";

//sar110-119 debriefs
const SavedOrSubmittedForm = () => {
  const [form, setForm] = useState<GenericForm | null>(null); // Initialize as null
  const params = useParams();
  
  useEffect(() => {
    const getInitialState = async () => {
      const docRef = doc(db, "incidents", String(params.incidentId), "forms", String(params.formId));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) { // Check if the document exists
        const formData = docSnap.data() as GenericForm;
        console.log("FORM DATA: ", formData);
        setForm({ ...formData });
      } else {
        console.error("Document does not exist"); // Should be impossible since it wouldn't have displayed
      }
    };
    getInitialState()
    .catch(console.error);
  }, []);

  if (!form) {
    return <div>Loading...</div>;
  }

  return <Form name={form.key} initialFormState={form} photoURL={form.photoURL || null} />;
};

export default SavedOrSubmittedForm;
