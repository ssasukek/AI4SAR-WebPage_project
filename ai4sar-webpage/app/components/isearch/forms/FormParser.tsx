"use client";
import { useEffect, useState, useReducer, Key } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  Collapse,
  FormGroup,
  Input,
  InputGroup,
  Label,
  CardTitle,
  Table,
} from "reactstrap";
import formReducer from "../reducers/FormReducer";
import { db } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Submission from "./Submission";
import fillForm from "../utils/FillForm";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { GenericForm } from "./Form";
import { storage } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";


var index1 = 0;

// Initial form state
// Generates a list of all fields in the form with empty values
const GenerateInitialFormState = (formJSON: object) => {
  console.log("formJSON is of type", typeof formJSON);
  let initialFormState = JSON.parse(JSON.stringify(formJSON)) as GenericForm;
  initialFormState.sections.forEach((section) => {
    FormatSection(section);
  });

  return initialFormState;
};

// Recursive helper to format sections
const FormatSection = async (section) => {
  section.fields.forEach((field) => {
    if (field.subsection) {
      FormatSection(field);
    } else if (field.dynamic) {
      field.values = [""];
    } else if (field.table) {
      field.values = {};
      if (field.dynamicTable) {
        field.columns.forEach((col) => {
          field.values[combineTableFieldName(field.dynamicTable, "", col)] = [];
          field.rows.forEach((row) => {
            field.values[
              combineTableFieldName(field.dynamicTable, "", col)
            ].push("");
          });
        });
      }
      field.value = "";
    } else {
      // Ensure all standard fields have default values
      field.value = field.value || "";
      field.values = field.values || [];
      field.placeholder = field.placeholder || "";
      field.type = field.type || "text";
    }
  });
};

/**
 * Fetch an incident document from firebase
 * @param {number} incidentId of the desired incident
 * @returns the existing data for the incident if it exists, undefined otherwise
 */
const fetchInitialIncidentData = async (incidentId) => {
  const formsCollectionRef = doc(db, "incidents", incidentId);
  try {
    let docSnapshot = await getDoc(formsCollectionRef);
    let preexistingData = docSnapshot.data();
    return preexistingData;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

// Helper function to combine table row/column names
const combineTableFieldName = (dynamicT, row, col) => {
  if (dynamicT) {
    return col.name.toLowerCase();
  } else {
    return (
      row[0].toLowerCase() +
      row.slice(1) +
      col.name[0].toUpperCase() +
      col.name.slice(1)
    ).replace(/\(.*\)|[^a-zA-Z]/g, "");
  }
};

// Standard field input
const StandardField = ({ field, indexList, dispatch, currentUser }) => {
  if (field.label === "Photo available") {
    console.log(field.value);
  }
  const handleTextChange = (e) => {
    dispatch({
      type: "HANDLE INPUT TEXT",
      indexList: indexList,
      payload: field.type === "checkbox" ? e.target.checked : e.target.value,
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
          field.type === "checkbox"
            ? { marginTop: "5px", marginRight: "10px" }
            : {}
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
        value={field.value}
        checked={field.value}
        onChange={(e) => handleTextChange(e)}
      />
    </div>
  );
};

// Single dynamic field input
const DynamicField = ({ field, indexList, dispatch }) => {
  const handleAdd = () => {
    dispatch({
      type: "ADD NEW FIELD",
      indexList: indexList,
      payload: "",
    });
  };

  return (
    <>
      {field.values.map((value, index) => (
        <div key={`${field.name}-${index}`}>
          <Label for={field.name}>{field.label}</Label>
          <InputGroup>
            <Input
              style={field.values.length > 1 ? { borderRight: "none" } : {}}
              className="form-input"
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={value}
              checked={value}
              onChange={(e) =>
                dispatch({
                  type: "HANDLE DYNAMIC TEXT",
                  indexList: indexList,
                  payload:
                    field.type === "checkbox"
                      ? e.target.checked
                      : e.target.value,
                  index: index,
                })
              }
            />
            {field.values.length > 1 && (
              <Button
                style={{ borderLeft: "none", zIndex: "0" }}
                className="form-input"
                color="danger"
                onClick={() =>
                  dispatch({
                    type: "REMOVE FIELD",
                    indexList: indexList,
                    index: index,
                  })
                }
              >
                Remove
              </Button>
            )}
          </InputGroup>
        </div>
      ))}
      <div
        style={{
          marginTop: "calc(1vh + 1rem)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={() => handleAdd()} style={{ background: "#00563A" }}>
          Add
        </Button>
      </div>
    </>
  );
};

// Table input
const TableField = ({ field, indexList, dispatch }) => {
  const handleAdd = () => {
    console.log("Adding new table field"); // Moved console.log here
    index1++;
    dispatch({
      type: "ADD NEW TABLE FIELD",
      indexList: indexList,
      index: index1,
      payload: field.type === "checkbox" ? false : "",
      field: field,
    });
    index1 = 0; //shouldn't ever cause a problem
  };

  const handleTableChange = (e, fieldName, index) => {
    dispatch({
      type: "HANDLE DYNAMIC TABLE TEXT",
      indexList: indexList,
      fieldName: fieldName,
      index: index,
      payload: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  return (
    <Table responsive>
      <thead>
        <tr>
          {field.columnHeading ? <th>{field.columnHeading}</th> : <th />}
          {field.columns.map((column, colIndex) => (
            <th key={`${field.name}-col-${colIndex}`}>{column.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {field.rows.map((row, rowIndex) => (
          <tr key={`${field.name}-row-${rowIndex}`}>
            <th scope="row">{row}</th>
            {field.columns.map((column, colIndex) => {
              const fieldName = combineTableFieldName(
                field.dynamicTable,
                row,
                column,
              );
              return (
                <td key={`${fieldName}-${rowIndex}-${colIndex}`}>
                  <Input
                    className="form-input"
                    type={column.type}
                    name={fieldName}
                    value={
                      field.dynamicTable
                        ? field.values[fieldName][rowIndex]
                        : field.values[fieldName]
                    }
                    checked={
                      field.dynamicTable
                        ? field.values[fieldName][rowIndex]
                        : field.values[fieldName]
                    }
                    placeholder={column.placeholder}
                    onChange={(e) => handleTableChange(e, fieldName, rowIndex)}
                  />
                </td>
              );
            })}
          </tr>
        ))}
        {field.dynamicTable && (
          <tr>
            <td
              colSpan={field.columns.length + 1}
              style={{ textAlign: "center" }}
            >
              <Button
                onClick={() => handleAdd()}
                style={{ background: "#00563A" }}
              >
                Add
              </Button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

const PhotoUploadField = ({ field, indexList, dispatch, photoURL }) => {
  const [uploadImage, setUploadImage] = useState(null);
  const params = useParams();
  console.log("params for formparser: ", params);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `photos/${file.name}`);
    try {
      const uploadTask = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      setUploadImage(downloadURL);
      console.log(params);
      dispatch({
        type: "HANDLE PHOTO UPLOAD",
        indexList: indexList,
        payload: downloadURL,
      });
    } catch (error) {
      console.error("error uploading photo", error);
    }
  };

  const imageStyle = {
    width: "200px",
    height: "300px",
  };

  if (params.formId) {
  }

  return (
    <FormGroup>
      <Label for={field.name}>{field.label}</Label>
      <Input
        type="file"
        id={field.name}
        name={field.name}
        onChange={handlePhotoUpload}
      />
      {photoURL || uploadImage ? (
        <img
          src={uploadImage ? uploadImage : photoURL}
          alt="Uploaded"
          style={{ width: `30%`, height: `auto` }}
        />
      ) : null}
    </FormGroup>
  );
};

// Expandable card section
const FormSection = ({
  section,
  indexList,
  dispatch,
  cardsExpand,
  showAllFields,
  currentUser,
  photoURL,
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
          <CardTitle
            id="card-title"
            style={{ flexGrow: "1", textAlign: "center" }}
          >
            <b>{section.heading}</b>
          </CardTitle>
        </div>
        <Collapse isOpen={isOpen}>
          <FormGroup>
            {section.fields.map((field, index: Key) => {
              if (showAllFields || field.shortForm) {
                if (field.subsection) {
                  return (
                    <FormSection
                      section={field}
                      indexList={[...indexList, index]}
                      dispatch={dispatch}
                      cardsExpand={isOpen}
                      showAllFields={showAllFields}
                      key={`subsection-${index}`}
                      currentUser={currentUser}
                      photoURL={photoURL}
                    />
                  );
                } else if (field.dynamic) {
                  return (
                    <DynamicField
                      field={field}
                      indexList={[...indexList, index]}
                      dispatch={dispatch}
                      key={`dynamic-${index}`}
                    />
                  );
                } else if (field.table) {
                  return (
                    <TableField
                      field={field}
                      indexList={[...indexList, index]}
                      dispatch={dispatch}
                      key={`table-${index}`}
                    />
                  );
                } else if (field.type === "file") {
                  return (
                    <PhotoUploadField
                      field={field}
                      indexList={[...indexList, index]}
                      dispatch={dispatch}
                      key={`file-${index}`}
                      photoURL={photoURL}
                    />
                  );
                } else {
                  return (
                    <StandardField
                      field={field}
                      indexList={[...indexList, index]}
                      dispatch={dispatch}
                      currentUser={currentUser}
                      key={`standard-${index}`}
                    />
                  );
                }
              }
              return null;
            })}
          </FormGroup>
        </Collapse>
      </CardBody>
    </Card>
  );
};

const FormBody = ({
  formState,
  dispatch,
  cardsExpand,
  showAllFields,
  currentUser,
  photoURL,
}) => {
  return (
    <>
      {formState.sections
        .filter((section) => showAllFields || section.shortForm)
        .map((section, index) => (
          <FormSection
            section={section}
            indexList={[index]}
            dispatch={dispatch}
            cardsExpand={cardsExpand}
            showAllFields={showAllFields}
            currentUser={currentUser}
            key={`section-${index}`}
            photoURL={photoURL}
          />
        ))}
    </>
  );
};

const FormParser = ({
  formJSON,
  initialFormState,
  photoURL,
}: {
  formJSON: any;
  initialFormState: GenericForm;
  photoURL: string;
}) => {
  const params = useParams();
  const [formState, dispatch] = useReducer(
    formReducer,
    initialFormState ? initialFormState : GenerateInitialFormState(formJSON),
  );

  const [submit, setSubmit] = useState(false);
  const [cardsExpand, setCardsExpand] = useState(true);
  const [showAllFields, setShowAllFields] = useState(!formState.hasShortForm);
  const [collapseToolbar, setCollapseToolbar] = useState(false);
  const { user } = useUser();
  const currentUser = user;
  const uid = user?.id ?? null;   const navigate = useRouter();
  const collectionRef = collection(
    db,
    "incidents",
    String(params.incidentId),
    "forms",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAndPrepopulateForm = () => {
    dispatch({ type: "SET STATE", payload: formState });
    console.log("form state is ", formState);

    fetchInitialIncidentData(params.incidentId)
      .then((data) => {
        if (data) {
          try {
            dispatch({ type: "PRE POPULATE", payload: data });
          } catch (e) {
            console.error("Tried to pre-populate form, got error", e);
          }
        }
      })
      .catch((e) => console.log(e));
  };

  // re-setup the form every time the formJSON changes
  // aka every time the user switches between forms
  useEffect(() => {
    loadAndPrepopulateForm();
  }, [formJSON]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (initialFormState) {
        const data = fillForm(formState, submit, currentUser);
        await setDoc(doc(collectionRef, String(params.formId)), data);
      } else {
        const data = fillForm(formState, submit, currentUser);
        console.log(data);
        await addDoc(collectionRef, data);
      }
      navigate.push(`/private/incidents/${params.incidentId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScroll = (e) => {
    if (window.scrollY > 0) {
      setCollapseToolbar(true);
    } else {
      setCollapseToolbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
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
            {formState.title}
          </h1>
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <Button
            onClick={() =>
              navigate.push(`/private/incidents/${params.incidentId}`)
            }
            style={{ marginBottom: "5px" }}
          >
            Return to Incident
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
            {formState.hasShortForm && (
              <Button
                onClick={() => setShowAllFields(!showAllFields)}
                style={{ background: "#00563A", marginLeft: "8px" }}
              >
                {showAllFields
                  ? "Hide Additional Data Fields"
                  : "Show All Data Fields"}
              </Button>
            )}
          </div>
          <Input
            id={"header-filter"}
            style={{ flex: 1, zIndex: 2, minWidth: "300px" }}
            type="text"
            disabled
          />
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)}>
        <FormBody
          formState={formState}
          dispatch={dispatch}
          cardsExpand={cardsExpand}
          showAllFields={showAllFields}
          currentUser={currentUser}
          photoURL={photoURL}
        />
        <Submission initialFormState={formState} setSubmit={setSubmit} />
      </form>
    </div>
  );
};

export default FormParser;
