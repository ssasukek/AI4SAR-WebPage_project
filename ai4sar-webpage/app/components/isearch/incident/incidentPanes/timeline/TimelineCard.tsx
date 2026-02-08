import React from "react";
import { Card } from "reactstrap";

export const TimelineCard = (props) => {
  let { time } = props;
  return (
    <Card
      style={{
        padding: "5px 10px",
        minHeight: "350px",
      }}
    >
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <b>Last Seen:</b>
            </div>
            <div>{time["lastSeen"]}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <b>Time Since Last Seen:</b>
            </div>
            <div>{time["timeSince"]}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <b>Reported Missing:</b>
            </div>
            <div>{time["reportedMissing"]}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <b>SAR Arrived:</b>
            </div>
            <div>
              {time["sarArrived"].map((sar, index) => {
                return <div key={index}>{sar}</div>;
                {
                  /* key used to be {sar} */
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
