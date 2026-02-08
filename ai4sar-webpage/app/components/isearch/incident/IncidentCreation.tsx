"use client";
import React, { useEffect, useState, useReducer } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../Firebase-config";
import {
  Button,
  Card,
  CardBody,
  Collapse,
  FormGroup,
  Input,
  Label,
  CardTitle,
} from "reactstrap";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import creationJSON from "../forms/json/incidentCreation.json";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import Submission from "../forms/Submission";
import incidentReducer, { IncidentReducerAction } from "../reducers/IncidentReducer";
import fillForm from "../utils/FillForm";
import { GenericForm, FormField, type FormSection } from "../forms/Form";

export interface CreationJSON {
  sections: FormSection[];
}

export interface StandardFieldProps {
  field: FormField;
  formState: IncidentObject;
  dispatch: React.Dispatch<IncidentReducerAction>;
}

export interface FormBodyProps {
  creationJSON: CreationJSON;
  formState: IncidentObject;
  dispatch: React.Dispatch<IncidentReducerAction>;
  cardsExpand: boolean;
}

export interface FormSectionProps {
  section: FormSection;
  formState: IncidentObject;
  dispatch: React.Dispatch<IncidentReducerAction>;
  cardsExpand: boolean;
}

export interface IncidentObject {
  incidentName: string;
  viewableBy?: string;
  incidentNumber: number;
  incidentDate: string;
  oesIncidentNumber?: string;
  sheriffName: string;
  sheriffPhoneNumber?: string;
  commandPostTelephone?: string;
  initialRadioChannel: string;
  commandPostLocation: string;
  commandPostLatitude?: string;
  commandPostLongitude?: string;
  missingPersonName: string;
  missingPersonAge?: string;
  missingPersonSex?: string;
  missingPersonPls?: string;
  missingPersonPlsLatitude?: string;
  missingPersonPlsLongitude?: string;
  missingPersonAlert?: string;
  reportingPersonName?: string;
  reportingPersonPhone?: string;
  reportingPersonAddress?: string;
  incidentPreparedBy: string;
  incidentDatePrepared: string;
  incidentTimePrepared: string;
  incidentPreparedData: string;
}

const generateInitialForm = (creationJSON: CreationJSON): IncidentObject =>
  creationJSON.sections
    .map((section) => reduceSection(section, {} as IncidentObject))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {} as IncidentObject);

const reduceSection = (section: FormSection, acc: IncidentObject): IncidentObject => {
  return section.fields.reduce((acc, curr) => {
    if (curr.subsection && curr.fields) {
      return reduceSection({ heading: "", fields: curr.fields }, acc);
    } else {
      return { ...acc, [curr.name]: "" };
    }
  }, acc);
};

const StandardField: React.FC<StandardFieldProps> = ({
  field,
  formState,
  dispatch,
}) => {
  const [isValid, setIsValid] = useState(true); // To track validity of the input field
  const [errorMessage, setErrorMessage] = useState("");

  const handleBlur = (e) => {
    let value = e.target.value;
    let newValue = "";
    let errorMessage = "";

    // Coordinate field validation
    if (field.name === "commandPostLatitude" || field.name === "commandPostLongitude") {
      if (value === "") {
        newValue = "";
        errorMessage = "This field is required.";
      } else {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          newValue = value;
          errorMessage = "Please enter a valid number.";
        } else {
          newValue = String(numValue);
          const valueInRange = numValue >= field.min && numValue <= field.max;
          if (!valueInRange) {
            errorMessage = `Value must be between ${field.min} and ${field.max}.`;
          }
        }
      }

      // Update validity state based on validation
      setIsValid(errorMessage === "");
      setErrorMessage(errorMessage);

      dispatch({
        type: "HANDLE INPUT TEXT",
        field: e.target.name,
        payload: newValue,
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "HANDLE INPUT TEXT",
      field: e.target.name,
      payload: e.target.value,
    });
  };

  // Apply red border style if invalid
  const inputStyle = !isValid ? { borderColor: "red", borderWidth: "2px" } : {};

  return (
    <div
      style={
        field.type === "checkbox"
          ? { display: "flex", flexDirection: "row", alignItems: "center" }
          : {}
      }
    >
      <Label
        style={
          field.type === "checkbox" ? { marginTop: "5px", marginRight: "10px" } : {}
        }
        for={field.name}
      >
        {field.label}
      </Label>
      <Input
        className="form-input"
        type={field.type}
        id={field.name}
        name={field.name}
        min="0"
        placeholder={field.placeholder}
        value={formState[field.name] || ""}
        onChange={handleTextChange}
        onBlur={handleBlur}
        style={inputStyle}
      />
      {/* Show error message if not valid */}
      {!isValid && (
        <span style={{ color: "red", fontSize: "12px" }}>{errorMessage}</span>
      )}
    </div>
  );
};

const FormBody: React.FC<FormBodyProps> = ({
  creationJSON,
  formState,
  dispatch,
  cardsExpand,
}) => {
  return (
    <>
      {creationJSON.sections.map((section, index) => (
        <FormSection
          key={index}
          section={section}
          formState={formState}
          dispatch={dispatch}
          cardsExpand={cardsExpand}
        />
      ))}
    </>
  );
};

const FormSection: React.FC<FormSectionProps> = ({
  section,
  formState,
  dispatch,
  cardsExpand,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(cardsExpand);
  }, [cardsExpand]);

  return (
    <Card className="cardStyles">
      <CardBody>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
            {isOpen ? <MdExpandLess /> : <MdExpandMore />}
          </div>
          <CardTitle id="card-title" style={{ flexGrow: "1", textAlign: "center" }}>
            <b>{section.heading}</b>
          </CardTitle>
        </div>
        <Collapse isOpen={isOpen}>
          <FormGroup>
            {section.fields.map((field, index) => (
              <StandardField
                key={index}
                field={field}
                formState={formState}
                dispatch={dispatch}
              />
            ))}
          </FormGroup>
        </Collapse>
      </CardBody>
    </Card>
  );
};

const IncidentCreation: React.FC = () => {
  const navigate = useRouter();
  const [formState, dispatch] = useReducer(
    incidentReducer,
    generateInitialForm(creationJSON as CreationJSON),
  );
  const [cardsExpand, setCardsExpand] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [collapseToolbar, setCollapseToolbar] = useState(false);
  const collectionRef = collection(db, "incidents");
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const viewableByArray = formState.viewableBy
      ? formState.viewableBy
          .split(",")
          .map((email: string) => email.trim())
          .filter(Boolean)
      : [];
    const data = fillForm(formState, submit, currentUser);
    data.viewableBy = viewableByArray;

    await addDoc(collectionRef, data);
    navigate.push("/incidents");
  };

  return (
    <div>
      <div
        style={{
          marginRight: "calc(.75rem + 4vw)",
          marginLeft: "calc(.75rem + 4vw)",
          paddingTop: "70px",
        }}
      >
        <div
          style={
            collapseToolbar
              ? {
                  position: "sticky",
                  top: "55px",
                  maxHeight: "400px",
                  padding: "8px 0px",
                  zIndex: 1,
                  backgroundColor: "#F0EEE8",
                  transitionDuration: "0.2s",
                }
              : {
                  position: "sticky",
                  top: "55px",
                  maxHeight: "800px",
                  padding: "8px 0px",
                  zIndex: 1,
                  backgroundColor: "#F0EEE8",
                  transitionDuration: "0.2s",
                }
          }
        >
          <div
            style={
              collapseToolbar
                ? {
                    position: "relative",
                    width: "100%",
                    maxHeight: 0,
                    transitionDuration: "0.2s",
                  }
                : {
                    position: "relative",
                    width: "100%",
                    maxHeight: "500px",
                    transitionDuration: "0.2s",
                  }
            }
          >
            <h1
              style={
                collapseToolbar
                  ? {
                      width: "100%",
                      fontSize: "calc(0.4rem + 1.5vw)",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      transitionDuration: "0.2s",
                    }
                  : {
                      width: 0,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      transitionDuration: "0.2s",
                    }
              }
            >
              Create New Incident
            </h1>
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            <Button
              onClick={() => navigate.push("/incidents")}
              style={{ marginBottom: "5px" }}
            >
              Return to iSearch
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                flex: 3,
                zIndex: 2,
              }}
            >
              <Button
                onClick={() => setCardsExpand(!cardsExpand)}
                style={{ background: "#00563A" }}
              >
                {cardsExpand ? "Collapse All Sections" : "Expand All Sections"}
              </Button>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <FormBody
            creationJSON={creationJSON as CreationJSON}
            formState={formState}
            cardsExpand={cardsExpand}
            dispatch={dispatch}
          />
          <Submission initialFormState={formState} setSubmit={setSubmit} />
        </form>
      </div>
    </div>
  );
};

export default IncidentCreation;
