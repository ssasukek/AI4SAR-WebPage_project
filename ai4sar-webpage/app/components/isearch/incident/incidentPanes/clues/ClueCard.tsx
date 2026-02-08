import React from "react";
import { Card } from "reactstrap";

export const ClueCard = (props) => {
  let { clue } = props;
  return (
    <Card
      style={{
        padding: "5px 10px",
      }}
    >
      <div>
        <h5>{clue["item found"]}</h5>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            textAlign: "left",
          }}
        >
          {/* Left column */}
          <div>
            <div>
              <b>Date:</b> {clue.date}
            </div>
            <div>
              <b>Time:</b> {clue.time}
            </div>
            <div>
              <b>Lat:</b> {clue["lat of find"]}
            </div>
            <div>
              <b>Long:</b> {clue["long of find"]}
            </div>
          </div>
          {/* Right column */}
          <div>
            <div>
              <b>Team:</b> {clue.team}
            </div>
            <div>
              <b>Initials:</b> {clue.initials}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
