"use client";
import React from "react";
import Header from "./Header";
import FormHeader from "./FormHeader";
import { useParams } from "next/navigation";

const Navigation = () => {
  const params = useParams();
  const incidentId = params?.incidentId || null;

  return <div>{incidentId ? <FormHeader incidentId={String(incidentId)} /> : <Header />}</div>;
};

export default Navigation;
