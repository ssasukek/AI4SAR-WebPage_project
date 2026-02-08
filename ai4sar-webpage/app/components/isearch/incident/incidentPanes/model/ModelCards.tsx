import React, { CSSProperties } from "react";
import { Card } from "reactstrap";

// Standard Loading Card
export const LoadingCard = () => {
  return <div style={cardStyle}>Loading...</div>;
};

// Standard Error Card
export const ErrorCard = () => {
  return <div style={cardStyle}>Error loading data</div>;
};

// template for a custom card
export const CustomCard = ({ children }) => {
  return <div style={cardStyle}>{children}</div>;
};

// ~~~ Prediction Model Cards ~~~ //

// input and output section components
export const InputSection = ({ children }) => (
  <div style={sectionStyle}>
    <div style={sectionHeaderStyle}>
      <b>Model Input</b>
    </div>
    {children}
  </div>
);

export const OutputSection = ({ children }) => (
  <div style={sectionStyle}>
    <div style={sectionHeaderStyle}>
      <b>Model Output</b>
    </div>
    {children}
  </div>
);

// card for the group behavior model
export const PredictCard = ({ groupSize, age, behavior, subjectData }) => {
  return (
    <Card style={cardStyle}>
      <InputSection>
        <div>
          <b>Group Size: </b>
          {groupSize}
        </div>
        {subjectData.map((subj, index) => (
          <div key={index}>
            {subj.name}: Age {subj.age}
          </div>
        ))}
      </InputSection>
      <OutputSection>
        <div>
          <b>Behavior of Missing Person or Group:</b> {behavior}
        </div>
      </OutputSection>
    </Card>
  );
};

// card for the total man hours prediction model
export const TotalManHoursPredictionCard = ({
  subjectCategory,
  subjectActivity,
  weatherConditions,
  age,
  result,
}) => {
  return (
    <Card style={cardStyle}>
      <InputSection>
        <div>
          <b>Subject Category: </b>
          {subjectCategory}
        </div>
        <div>
          <b>Subject Activity: </b>
          {subjectActivity}
        </div>
        <div>
          <b>Weather Conditions: </b>
          {weatherConditions}
        </div>
        <div>
          <b>Subject Age: </b>
          {age}
        </div>
      </InputSection>
      <OutputSection>
        <div>
          <b>Amount of Man Hours: </b>
          {result}
        </div>
      </OutputSection>
    </Card>
  );
};

// NOT FINISHED, waiting on model to finish being implimented
// Card for Geospatial Model Prediction
export const GeospatialModelPredictionCard = ({
  startTime,
  numberOfRangers,
  activity,
  subjectAge,
  subjectGender,
}) => {
  return (
    <Card style={cardStyle}>
      <InputSection>
        <div>
          <b>Start time: </b>
          {startTime}
        </div>
        <div>
          <b>Number of Rangers: </b>
          {numberOfRangers}
        </div>
        <div>
          <b>Activity: </b>
          {activity}
        </div>
        <div>
          <b>Subject Age: </b>
          {subjectAge}
        </div>
        <div>
          <b>Subject Gender: </b>
          {subjectGender}
        </div>
      </InputSection>
      <OutputSection>
        <div>Prediction results will be displayed here...</div>
      </OutputSection>
    </Card>
  );
};

// add more cards as needed

// ~~~ Styles ~~~ //

const cardStyle: CSSProperties = {
  padding: "10px",
  textAlign: "left",
  height: "100%",
};

const sectionStyle: CSSProperties = {
  marginBottom: "10px",
};

const sectionHeaderStyle: CSSProperties = {
  borderBottom: "1px solid black",
  marginBottom: "10px",
};
