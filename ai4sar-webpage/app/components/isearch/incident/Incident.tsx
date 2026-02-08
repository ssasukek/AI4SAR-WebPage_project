"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "../../Firebase-config";
import {
  collection,
  getDocs,
  doc,
  query,
  onSnapshot,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Placeholder,
  Tooltip,
} from "reactstrap";
import { MapProvider } from "./../../providers/map-provider";
import CluesPane from "./incidentPanes/clues/CluesPane";
import ResourcesPane from "./incidentPanes/ResourcesPane";
import TimelinePane from "./incidentPanes/timeline/TimelinePane";
import WeatherBox from "./WeatherBox";
import MissingPersonsPane from "./incidentPanes/MissingPersonsPane";
import { PredictionPane } from "./incidentPanes/model/PredictionPane";
import { MapComponent } from "./map";

interface FormCardData {
  key: string;
  title: string;
  author: string[] | string;
  timestamp: string;
  [key: string]: any;
}

interface Form {
  id: string;
  data: FormCardData;
}

interface IncidentData {
  incidentName?: string;
  commandPostLatitude?: number;
  commandPostLongitude?: number;
  [key: string]: any;
}

interface FormsProps {
  navState: number;
  incidentId: string;
  currentUser: { uid: string; displayName: string };
}

interface DashboardProps {
  incident: IncidentData;
}

const FormCard: React.FC<{ form: Form }> = ({ form }) => {
  const navigate = useRouter();
  const [tooltip1Open, setTooltip1Open] = useState(false);
  const [tooltip2Open, setTooltip2Open] = useState(false);

  const params = useParams();

  const handleClick = () => {
    navigate.push(`/incidents/${params.incidentId}/${form.id}`);
  };

  return (
    // {form.data.author.map((author) => (author + ", "))}
    <div onClick={() => handleClick()} style={{ cursor: "pointer", padding: "1rem" }}>
      <Card>
        <CardBody id="operation-card">
          <div
            style={{
              padding: "1.3rem 1.3rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h4>{form.data.key}</h4>
            <CardText
              id={`tooltip1-${form.id}`}
              style={{
                textDecoration: "underline",
              }}
            >
              {form.data.title.length > 16
                ? form.data.title.toString().substring(0, 17) + "..."
                : form.data.title}
            </CardText>
            <Tooltip
              placement="right"
              isOpen={tooltip1Open}
              target={`tooltip1-${form.id}`}
              toggle={() => {
                setTooltip1Open(!tooltip1Open);
              }}
            >
              {form.data.title}
            </Tooltip>
          </div>
          <div
            style={{
              background: "#1B312C",
              color: "white",
              //height: "140px",
              padding: "1rem 1rem",
            }}
          >
            {/* check in order to render old form cards with no "author" field */}
            <CardText>
              Author:{" "}
              {Array.isArray(form.data.author) ? (
                form.data.author.join(", ").length > 20 ? (
                  <>
                    <span
                      id={`tooltip2-${form.id}`}
                      style={{
                        textDecoration: "underline",
                      }}
                    >
                      {form.data.author[0] + " + " + (form.data.author.length - 1)}
                    </span>
                    <Tooltip
                      placement="right"
                      isOpen={tooltip2Open}
                      target={`tooltip2-${form.id}`}
                      toggle={() => {
                        setTooltip2Open(!tooltip2Open);
                      }}
                    >
                      {form.data.author.join(", ")}
                    </Tooltip>
                  </>
                ) : (
                  form.data.author.join(", ")
                )
              ) : (
                form.data.author
              )}
            </CardText>
            <CardText>Time: {form.data.timestamp}</CardText>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const Forms: React.FC<FormsProps> = ({ navState, incidentId, currentUser }) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [order, setOrder] = useState(0);
  const [asc, setAsc] = useState(true);
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);

  useEffect(() => {
    const getUserForms = async () => {
      const temp: Form[] = [];
      const formsRef = collection(db, "incidents", incidentId, "forms");
      const q =
        navState === 1
          ? query(
              formsRef,
              where("uid", "==", currentUser.uid),
              where("submitted", "==", false),
            )
          : navState === 2
            ? query(
                formsRef,
                where("author", "array-contains", currentUser.displayName),
                where("submitted", "==", true),
              )
            : query(formsRef, where("submitted", "==", true));
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const obj: Form = { id: doc.id, data: doc.data() as FormCardData };
        temp.push(obj);
      });
      temp.sort(
        (a, b) =>
          (order === 0
            ? a.data.key < b.data.key
              ? -1
              : 1
            : order === 1
              ? a.data.author[0] < b.data.author[0]
                ? -1
                : 1
              : a.data.timestamp < b.data.timestamp
                ? -1
                : 1) * (asc ? 1 : -1),
      );
      setForms(temp);
    };
    getUserForms().catch(console.error);
  }, [navState, order, asc]);

  const toggle1 = () => setDropdown1Open((prevState) => !prevState);
  const toggle2 = () => setDropdown2Open((prevState) => !prevState);

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          marginRight: "calc(.75rem + 10vw)",
          marginLeft: "calc(.75rem + 10vw)",
          paddingTop: "calc(.75rem + 2vw)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Dropdown
            isOpen={dropdown1Open}
            toggle={toggle1}
            style={{ marginRight: "1rem" }}
          >
            <DropdownToggle caret>
              {order === 0
                ? "Sort By: Form Type"
                : order === 1
                  ? "Sort By: Author"
                  : "Sort By: Time"}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  setOrder(0);
                }}
              >
                Form Type
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  setOrder(1);
                }}
              >
                Author
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  setOrder(2);
                }}
              >
                Time
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown
            isOpen={dropdown2Open}
            toggle={toggle2}
            style={{
              marginRight: "1rem",
            }}
          >
            <DropdownToggle caret>
              {asc ? "Order: Ascending" : "Order: Descending"}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  setAsc(true);
                }}
              >
                Ascending
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  setAsc(false);
                }}
              >
                Descending
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Input
          id={"sort-filter"}
          style={{ marginBottom: 0 }}
          bsSize="sm"
          className="form-input"
          disabled
        ></Input>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          paddingRight: "1.5rem",
          paddingLeft: "1.5rem",
        }}
      >
        {forms.length
          ? forms.map((form, idx) => <FormCard form={form} key={idx} />)
          : "Empty"}
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ incident }) => {
  console.log(
    `Dashboard lat and long for ${incident}: `,
    incident.commandPostLatitude,
    incident.commandPostLongitude,
    incident,
  );
  // This component will display six gray boxes
  return (
    <div>
      <div
        style={{
          padding: "1.5rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(150px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/*Missing Person Info box */}
        <div style={{ background: "#ccc", padding: "1rem", minHeight: "200px" }}>
          <MissingPersonsPane incident={incident} />
          <div style={{ textAlign: "left" }}></div>
        </div>
        <div
          style={{
            background: "#ccc",
            padding: "1rem",
            minHeight: "200px",
            textAlign: "center",
          }}
        >
          <CluesPane />
        </div>
        <div
          style={{
            background: "#ccc",
            padding: "1rem",
            minHeight: "200px",
            textAlign: "center",
          }}
        >
          {/* incident map! */}
          {incident.commandPostLatitude && incident.commandPostLongitude ? (
            <MapProvider>
              <MapComponent
                commandPostLatitude={incident.commandPostLatitude}
                commandPostLongitude={incident.commandPostLongitude}
              />
            </MapProvider>
          ) : (
            <>
              <b>Map</b>
              <br></br>
              <br></br>
              <>No coordinates to display 📝</>
            </>
          )}
        </div>
        <div
          style={{
            background: "#ccc",
            padding: "1rem",
            minHeight: "200px",
            textAlign: "center",
          }}
        >
          <div style={{ height: "40px", marginBottom: "5px" }}>
            <b>Resources</b>
          </div>
          <ResourcesPane />
        </div>
        <div
          style={{
            background: "#ccc",
            padding: "1rem",
            minHeight: "200px",
            textAlign: "center",
          }}
        >
          <TimelinePane />
        </div>
        <div
          style={{
            background: "#ccc",
            padding: "1rem",
            minHeight: "200px",
            textAlign: "center",
          }}
        >
          <WeatherBox />
        </div>
      </div>
    </div>
  );
};

const Incident: React.FC = () => {
  const { currentUser } = useAuth();
  const [incident, setIncident] = useState<IncidentData>([]);
  const [navState, setNavState] = useState(0);
  const params = useParams();
  console.log("Incident ID:", params.incidentId);
  const navigate = useRouter();

  // Sets up real-time listener to the Firestore document
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "incidents", params.incidentId as string),
      (doc) => {
        // Stores incident data
        setIncident(doc.data() as IncidentData);
      },
    );
    return () => unsubscribe();
  }, []);
  console.log(incident);

  return (
    <div>
      <div className="page-header">
        {incident?.incidentName ? (
          <h1>{incident.incidentName}</h1>
        ) : (
          <Placeholder
            xs={5}
            style={{
              height: "3.0rem",
              marginBottom: "0.5rem",
              borderRadius: "var(--bs-border-radius)",
              backgroundColor: "#ccc",
            }}
          />
        )}
      </div>
      <div>
        {/* Navigation tabs */}
        <div style={{ display: "flex", padding: ".5rem 2rem" }}>
          <div
            className={`${navState === 0 ? "selected-nav" : "unselected-nav"}`}
            onClick={() => setNavState(0)}
          >
            <p id="header">Dashboard</p>
          </div>
          <div
            className={`${navState === 1 ? "selected-nav" : "unselected-nav"}`}
            onClick={() => setNavState(1)}
          >
            <p id="header">My Saved Forms</p>
          </div>
          <div
            className={`${navState === 2 ? "selected-nav" : "unselected-nav"}`}
            onClick={() => setNavState(2)}
          >
            <p id="header">My Submitted Forms</p>
          </div>
          <div
            className={`${navState === 3 ? "selected-nav" : "unselected-nav"}`}
            onClick={() => setNavState(3)}
          >
            <p id="header">All Submitted Forms</p>
          </div>
          <div
            className={`${navState === 4 ? "selected-nav" : "unselected-nav"}`}
            onClick={() => setNavState(4)}
          >
            <p id="header">AI Insight</p>
          </div>
          <Button
            onClick={() => navigate.push(`/incidents/${params.incidentId}/edit`)}
            style={{
              display: "flex",
              marginTop: "2px",
              marginRight: "calc(.75rem + 1vw)",
              marginLeft: "calc(1.5rem + 3vw)",
              background: "#006CF5",
            }}
          >
            {" "}
            Edit Incident Information{" "}
          </Button>
          <Button onClick={() => navigate.push(`/incidents/${params.incidentId}/searcher`)}>
            Create Searcher Profile
          </Button>
        </div>
      </div>

      {navState === 0 ? (
        <Dashboard incident={incident} />
      ) : navState >= 1 && navState <= 3 ? (
        <Forms
          navState={navState}
          incidentId={params.incidentId as string}
          currentUser={currentUser}
        />
      ) : navState === 4 ? (
        <PredictionPane />
      ) : null}
    </div>
  );
};

export default Incident;
