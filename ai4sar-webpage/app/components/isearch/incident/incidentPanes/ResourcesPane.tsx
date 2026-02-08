import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useAllResourcesOfIncident } from "../../queries/IncidentQueries";
import { Placeholder, Card, Input } from "reactstrap";
import { Resource } from "../../queries/IncidentQueries";

const signedInColor = "#7FEF67";
const notSignedInColor = "#EA845E";

interface HeaderProps {
  children?: React.ReactNode;
}

interface Checkbox {
  name: string;
  show: boolean;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
  color: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div
      style={{
        marginBottom: "5px",
        position: "relative",
        height: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          textAlign: "center",
        }}
      >
        {/* Left column */}
        <div>
          <div>
            <b>Agency</b>
          </div>
        </div>
        {/* Right column */}
        <div>
          <div>
            <b>Headcount</b>
          </div>
        </div>
      </div>
      {props.children}
    </div>
  );
};

const ResourcesPane: React.FC = () => {
  const params = useParams();
  const allResourcesQuery = useAllResourcesOfIncident(params.incidentId as string);
  const [signedInState, setSignedIn] = useState<boolean>(true);
  const [notSignedInState, setNotSignedIn] = useState<boolean>(false);
  const [expandResourceState, setExpandResource] = useState<boolean[]>([]);

  function handleClick(index: number): void {
    const newExpandedResource = [...expandResourceState];
    newExpandedResource[index] = !newExpandedResource[index];
    setExpandResource(newExpandedResource);
  }

  if (allResourcesQuery.isLoading) {
    return (
      <div>
        <Header></Header>
        {/* Placeholders for clues */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {[1, 2].map((i) => (
            <Placeholder
              animation="wave"
              key={i}
              style={{
                display: "block",
              }}
            >
              <Placeholder
                style={{
                  borderRadius: "var(--bs-border-radius)",
                  height: "150px",
                  backgroundColor: "white",
                }}
                xs={12}
              />
            </Placeholder>
          ))}
        </div>
      </div>
    );
  }

  if (allResourcesQuery.isError) {
    return (
      <div>
        <Header />
        <b>Resources failed to fetch :(</b>
      </div>
    );
  }

  const checkboxes: Checkbox[] = [
    {
      name: "Signed in",
      show: signedInState,
      toggle: setSignedIn,
      color: signedInColor,
    },
    {
      name: "Not Signed in",
      show: notSignedInState,
      toggle: setNotSignedIn,
      color: notSignedInColor,
    },
  ];

  if (expandResourceState.length === 0 && allResourcesQuery.data.length !== 0) {
    setExpandResource(
      allResourcesQuery.data.map(() => false)
    );
  }

  return (
    <div>
      <div
        style={{
          height: "10%",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          paddingBottom: "1%",
        }}
      >
        {checkboxes.map((checkbox, index) => (
          <div key={`checkbox${index}`} style={{ display: "flex" }}>
            <Input
              style={{ marginRight: "3%" }}
              type="checkbox"
              checked={checkbox.show}
              onChange={() => checkbox.toggle(!checkbox.show)}
            />
            <div
              style={{
                whiteSpace: "nowrap",
                backgroundColor: checkbox.color,
                borderRadius: "10%",
              }}
            >
              {checkbox.name}
            </div>
          </div>
        ))}
      </div>
      <Card
        style={{
          padding: "5px 10px",
          minHeight: "350px",
        }}
      >
        <Header></Header>
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {allResourcesQuery.data.length === 0 && "No resources to display 📝"}
          {allResourcesQuery.data.map((resource: Resource, i: number) => (
            <div key={i} onClick={() => handleClick(i)}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  textAlign: "center",
                }}
              >
                {/* Left column */}
                <div>
                  <div>
                    <b>{resource.agency}</b>
                  </div>
                  {resource.agencyResources.map((item) => {
                    if (expandResourceState.length !== 0 && expandResourceState[i]) {
                      if (signedInState && item.signedIn) {
                        return (
                          <div
                            key={item.resourceName}
                            style={{ backgroundColor: signedInColor }}
                          >
                            <i>{item.resourceName}</i>
                          </div>
                        );
                      } else if (notSignedInState && !item.signedIn) {
                        return (
                          <div
                            key={item.resourceName}
                            style={{ backgroundColor: notSignedInColor }}
                          >
                            <i>{item.resourceName}</i>
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                </div>
                <div>
                  <div>
                    <b>{resource.headcount}</b>
                  </div>
                  {resource.agencyResources.map((item) => {
                    if (expandResourceState.length !== 0 && expandResourceState[i]) {
                      if (signedInState && item.signedIn) {
                        return (
                          <div
                            key={`${item.resourceName}-signedIn`}
                            style={{ backgroundColor: signedInColor }}
                          ></div>
                        );
                      } else if (notSignedInState && !item.signedIn) {
                        return (
                          <div
                            key={`${item.resourceName}-notSignedIn`}
                            style={{ backgroundColor: notSignedInColor }}
                          ></div>
                        );
                      }
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ResourcesPane;
