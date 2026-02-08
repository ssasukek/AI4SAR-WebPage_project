"use client";
import { useEffect, useState, useReducer } from "react";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
import { useRouter, useParams } from "next/navigation";
import creationJSON from "../forms/json/incidentCreation.json";
import { MdEmojiObjects, MdExpandLess, MdExpandMore } from "react-icons/md";
import Submission from "../forms/Submission";
import incidentReducer from "../reducers/IncidentReducer";
import fillForm from "../utils/FillForm";
import { GenericForm, FormField, type FormSection } from "../forms/Form";
import { IncidentReducerAction } from "../reducers/IncidentReducer";
import {
  CreationJSON,
  StandardFieldProps,
  FormBodyProps,
  FormSectionProps,
  IncidentObject,
} from "./IncidentCreation";
import { useUser } from "@clerk/nextjs";

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

const fetchInitialIncidentData = async (
  incidentId: string,
  dispatch: React.Dispatch<IncidentReducerAction>,
): Promise<IncidentObject | undefined> => {
  const formsCollectionRef = doc(db, "incidents", incidentId);
  try {
    const docSnapshot = await getDoc(formsCollectionRef);
    const preexistingData = docSnapshot.data();
    if (preexistingData) {
      Object.entries(preexistingData).forEach(([field, value]) => {
        dispatch({ type: "SET FIELD", payload: { field, value } });
      });
    }
    return preexistingData as IncidentObject;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const StandardField: React.FC<StandardFieldProps> = ({
  field,
  formState,
  dispatch,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "HANDLE INPUT TEXT",
      field: e.target.name,
      payload: e.target.value,
    });
  };

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
        type={field.type || "text"}
        id={field.name}
        name={field.name}
        min="0"
        placeholder={field.placeholder}
        value={formState[field.name] || ""}
        onChange={handleTextChange}
      />
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
  cardsExpand,
  dispatch,
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

const IncidentEdit: React.FC<{ initialIncidentState?: GenericForm }> = ({
  initialIncidentState,
}) => {
  const navigate = useRouter();
  const [formState, dispatch] = useReducer(
    incidentReducer,
    generateInitialForm(creationJSON as CreationJSON),
  );
  const params = useParams();
  const [cardsExpand, setCardsExpand] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [collapseToolbar, setCollapseToolbar] = useState(false);
  const { user } = useUser();
  const currentUser = user;
  const uid = user?.id ?? null;
  useEffect(() => {
    if (params.incidentId) {
      fetchInitialIncidentData(params.incidentId as string, dispatch);
    }
  }, [params.incidentId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const viewableByArray =
      typeof formState.viewableBy === "string"
        ? formState.viewableBy
            .split(",")
            .map((email) => email.trim())
            .filter(Boolean)
        : [];

    const data = fillForm(formState, submit, currentUser);
    data.viewableBy = viewableByArray;
    await setDoc(doc(db, "incidents", params.incidentId as string), data);
    navigate.push("/private/incidents");
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
              Editing Incident
            </h1>
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            <Button
              onClick={() => navigate.push("/private/incidents")}
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

export default IncidentEdit;
