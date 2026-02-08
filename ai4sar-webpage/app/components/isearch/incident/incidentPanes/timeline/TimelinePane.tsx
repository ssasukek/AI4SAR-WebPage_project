import React, { ReactNode } from "react";
import { useParams } from "next/navigation";
import { useAllTimesOfIncident } from "../../../queries/IncidentQueries";
import { Placeholder } from "reactstrap";
import { TimelineCard } from "./TimelineCard";

interface HeaderProps {
  children?: ReactNode;
}

/**
 * Children of this component will be placed in a
 * `position: relative` container, underneath the title of the pane
 */
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
      <b>Timeline</b>
      {props.children}
    </div>
  );
};

const TimelinePane: React.FC = () => {
  const params = useParams() as { incidentId: string };
  const allTimelineQuery = useAllTimesOfIncident(params.incidentId);

  // display this when we're still fetching data
  if (allTimelineQuery.isLoading) {
    return (
      <div>
        <Header>
          {/* Button placeholder */}
          <Placeholder
            style={{
              borderRadius: "var(--bs-border-radius)",
              backgroundColor: "#6c757d",
            }}
          />
        </Header>

        {/* Placeholders for times */}
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

  // display this when there was a problem fetching the data,
  // and there's nothing cached to display alternatively
  if (allTimelineQuery.isError) {
    return (
      <div>
        <Header />
        <b>Timeline Data failed to fetch :(</b>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <TimelineCard time={allTimelineQuery.data} />
      </div>
    </div>
  );
};

export default TimelinePane;
