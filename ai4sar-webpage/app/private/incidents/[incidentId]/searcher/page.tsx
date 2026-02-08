"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

export default function SearcherProfile() {
  let router = useRouter();
  // get the incidentId from the parameters
  const params = useParams();
  // create a searcherProfiles collection for the specific incident
  const collectionRef = collection(
    db,
    "incidents",
    params.incidentId as string,
    "searcherProfiles",
  );
  // store data for the search profile in this dictionary
  const [data, setData] = useState({
    name: "",
    email: "",
    org: "",
    role: "",
  });

  // pushing to firebase
  const updateData = async (e) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.org || !data.role) {
      alert("Please fill out all the fields!");
    } else {
      // push the data into the collection
      await addDoc(collectionRef, data);
      // go back to the homepage
      router.push(`/private/incidents/${params.incidentId}`);
      console.log("Pushed data to the firebase!");
    }
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      {/* form for the searcher profile */}
      <Form style={{ margin: "10px" }} onSubmit={updateData}>
        <FormGroup style={{ marginLeft: "10px", marginRight: "10px" }} row>
          <Label for="name">Name</Label>
          <Input
            id="name"
            value={data.name}
            placeholder="Enter Name"
            type="text"
            onChange={(e) =>
              setData((curr) => ({ ...curr, name: e.target.value }))
            }
          />
        </FormGroup>
        <FormGroup style={{ marginLeft: "10px", marginRight: "10px" }} row>
          <Label for="emailAddress">Email</Label>
          <Input
            margin={10}
            id="emailAddress"
            value={data.email}
            placeholder="Enter Email"
            type="email"
            onChange={(e) =>
              setData((curr) => ({ ...curr, email: e.target.value }))
            }
          />
        </FormGroup>

        <FormGroup style={{ marginLeft: "10px", marginRight: "10px" }} row>
          <Label for="org">Organization You're a Part of</Label>
          <Input
            value={data.org}
            margin={10}
            id="org"
            placeholder="Enter Organization"
            type="text"
            onChange={(e) =>
              setData((curr) => ({ ...curr, org: e.target.value }))
            }
          />
        </FormGroup>
        <FormGroup check tag="fieldset" row>
          <Label>Role Field</Label>
          <FormGroup check>
            <Input
              name="organizer"
              type="radio"
              checked={data.role === "Organizer"}
              onChange={() =>
                setData((curr) => ({ ...curr, role: "Organizer" }))
              }
            />{" "}
            <Label check>Organizer</Label>
          </FormGroup>
          <FormGroup check>
            <Input
              name="searcher"
              type="radio"
              checked={data.role === "Searcher"}
              onChange={() =>
                setData((curr) => ({ ...curr, role: "Searcher" }))
              }
            />{" "}
            <Label check>Searcher</Label>
          </FormGroup>
        </FormGroup>
        <Button style={{ margin: "10px" }} type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
