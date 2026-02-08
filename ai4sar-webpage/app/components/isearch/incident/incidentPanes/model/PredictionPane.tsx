import { useState, CSSProperties } from "react";
import { GroupBehaviorModel, TotalManHoursModel, GeospatialModel, WanderPredictor2, PriorityPredictor } from "./Models";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { FaInfoCircle } from "react-icons/fa";

// Header formatter for a model prediction pane card
const Header = ({
  title = "Prediction Outcome",
  description = "No description available.",
  onInfoClick,
}) => {
  // Added hover to make info button pop out more to user
  const [hovered, setHovered] = useState(false);

  const infoButtonStyle = {
    cursor: "pointer",
    marginLeft: "auto",
    marginRight: "10px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "30px",
    padding: 0,
    color: hovered ? "#0056D2" : "#007BFF",
    hover: "transform: scale(1.35)",
    transition: "transform 0.3s ease",
    transform: hovered ? "scale(1.35)" : "scale(1)",
    borderRadius: "50%",
    height: "30px",
    width: "30px",
    display: "flex",
  };

  return (
    <div style={headerStyle}>
      <b>{title}</b>
      <Button
        style={infoButtonStyle}
        onClick={onInfoClick}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        title="More Info"
      >
        <FaInfoCircle />
      </Button>
    </div>
  );
};

// Pane that holds all the AI models
export const PredictionPane = () => {
  // States to control the visibility of modals for each section
  const [modalOpen, setModalOpen] = useState({
    groupBehavior: false,
    totalManHours: false,
    geospatial: false,
    wanderPredictor2: false,
    priorityPredictor: false,
  });

  // Toggle modal open/close
  const toggleModal = (modal) => {
    setModalOpen((prevState) => ({
      ...prevState,
      [modal]: !prevState[modal],
    }));
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <Header
          title="Group Behavior Prediction"
          onInfoClick={() => toggleModal("groupBehavior")}
        />
        {GroupBehaviorModel()}

        <Modal
          isOpen={modalOpen.groupBehavior}
          toggle={() => toggleModal("groupBehavior")}
        >
          <ModalHeader toggle={() => toggleModal("groupBehavior")}>
            Group Behavior Prediction Info
          </ModalHeader>
          <ModalBody>
            This AI model predicts whether a person(s) is more likely to either{" "}
            <strong>a)</strong> wander or <strong>b)</strong> stay put in their current
            situation.
            <br></br>
            <br></br>
            <strong>INPUTS:</strong>
            <ul>
              <li>
                <strong>Group size:</strong> Calculated from the number of SAR100A forms
                that have been submitted.
              </li>
              <li>
                <strong>Ages:</strong> Calculated from the 'age' field in SAR100A forms
                that have been submitted.
              </li>
            </ul>
          </ModalBody>
        </Modal>
      </div>

      <div style={cardStyle}>
        <Header
          title="Wander Predictor 2"
          onInfoClick={() => toggleModal("wanderPredictor2")}
        />
        {WanderPredictor2()}

        <Modal
          isOpen={modalOpen.wanderPredictor2}
          toggle={() => toggleModal("wanderPredictor2")}
        >
          <ModalHeader toggle={() => toggleModal("wanderPredictor2")}>
            Wander Predictor 2 Info
          </ModalHeader>
          <ModalBody>
            This is a second AI model that predicts whether a person(s) is likely to wander.
            <br></br>
            <br></br>
            <strong>INPUTS:</strong>
            <ul>
              <li>
                <strong>Group size:</strong> Calculated from the number of SAR100A forms
                that have been submitted.
              </li>
              <li>
                <strong>Age:</strong> Average age calculated from the 'age' field in SAR100A forms
                that have been submitted.
              </li>
            </ul>
          </ModalBody>
        </Modal>
      </div>

      <div style={cardStyle}>
        <Header
          title="Total Man Hours Prediction"
          onInfoClick={() => toggleModal("totalManHours")}
        />
        {TotalManHoursModel()}

        <Modal
          isOpen={modalOpen.totalManHours}
          toggle={() => toggleModal("totalManHours")}
        >
          <ModalHeader toggle={() => toggleModal("totalManHours")}>
            Total Man Hours Prediction Info
          </ModalHeader>
          <ModalBody>
            This AI model predicts how many total man-hours will be spent on the search
            operation until it is concluded.
            <br></br>
            <br></br> Except for the subject age, the inputs to this model are
            categorical, meaning for each categorical input we will be searching for one
            of the listed terms. In the form "Missing Person Questionnaire" there is a
            section called "Prior Events" and a field called "Describe prior events.
            Where was MP located last time?" This is where the model is searching for
            these categorical terms. <br></br>
            <br></br>
            Example of minimal input to this field that will yield values for all three
            of the categorical inputs: <br></br>
            "Intellectual disability biking partly cloudy"
            <br></br>
            <br></br>
            <strong>INPUTS:</strong>
            <ul>
              <li>
                <strong>Subject Category:</strong> Possible values : 'Child',
                'Dementia', 'Substance Intoxication', 'Youth', 'Autistic', 'Hiker',
                'Hunter', 'Climber', 'Despondent', 'Aircraft', 'Angler', 'Worker',
                'Vehicle', 'Snowboarder', 'Boater', 'Mental Illness', 'Runner', 'Caver',
                'Intellectual Disability', 'Extreme Sports', 'Gatherer', 'Abduction',
                'Motorcycle', 'Skier-Nordic', 'Vehicle-4wd', 'Skier-Alpine', 'ATV',
                'Aircraft-nonpowered', 'Camper', 'Horseback Rider', 'Runaway',
                'Walkaway'
              </li>
              <li>
                <strong>Subject Activity:</strong> Possible values : 'Playing',
                'Walkaway', 'Drinking', 'Tramping', 'Hunting', 'Climbing', 'Hiking',
                'Flying', 'Fishing', 'Working', 'Driving', 'Snowboarding', 'Boating',
                'Runaway', 'Running', 'Biking', 'Rafting', 'Caving', 'Mushroom Hunting',
                'Gathering', 'Other', 'playing', 'Skiing', 'fishing', 'hiking', 'drugs',
                'Extreme Sports', 'School', 'Camping', 'hiding', 'Criminal', 'hunting',
                'outing', 'Riding', 'Swimming'
              </li>
              <li>
                <strong>Weather Conditions:</strong> Possible values : 'Clear', 'Rain',
                'Overcast', 'Foggy', 'Snow', 'Hail', 'Cloudy', 'Partly cloudy',
                'Thunderstorm', 'Partly Cloudy', 'Drizzle', 'Showers', 'Sleet'
              </li>
              <li>
                <strong>Subject Age:</strong> Calculated from the 'age' field in SAR100A
                forms that have been submitted.
              </li>
            </ul>
          </ModalBody>
        </Modal>
      </div>

      <div style={cardStyle}>
        <Header
          title="Geospatial Model"
          onInfoClick={() => toggleModal("geospatial")}
        />
        {GeospatialModel()}

        <Modal isOpen={modalOpen.geospatial} toggle={() => toggleModal("geospatial")}>
          <ModalHeader toggle={() => toggleModal("geospatial")}>
            Geospatial Model Info
          </ModalHeader>
          <ModalBody>
            This model provides geospatial insights based on the provided data.
          </ModalBody>
        </Modal>
      </div>

      <div style={cardStyle}>
        <Header
          title="Priority Predictor"
          onInfoClick={() => toggleModal("priorityPredictor")}
        />
        {PriorityPredictor()}

        <Modal
          isOpen={modalOpen.priorityPredictor}
          toggle={() => toggleModal("priorityPredictor")}
        >
          <ModalHeader toggle={() => toggleModal("priorityPredictor")}>
            Priority Predictor Info
          </ModalHeader>
          <ModalBody>
            This AI model predicts the priority level and response level for a search and rescue operation based on various factors.
            <br></br>
            <br></br>
            <strong>INPUTS:</strong>
            <ul>
              <li><strong>Medical Category:</strong> Health status of the subject(s)</li>
              <li><strong>Terrain:</strong> Type of terrain where the subject(s) might be</li>
              <li><strong>Weather:</strong> Current or predicted weather conditions</li>
              <li><strong>Scenario:</strong> Type of search and rescue scenario</li>
              <li><strong>Age Group:</strong> Age category of the subject(s)</li>
              <li><strong>Experience:</strong> Subject's experience level</li>
              <li><strong>Equipment:</strong> Quality of equipment available</li>
              <li><strong>Clothing:</strong> Quality of clothing available</li>
              <li><strong>Survival Training:</strong> Level of survival training</li>
            </ul>
            <br></br>
            <strong>OUTPUTS:</strong>
            <ul>
              <li><strong>Priority Score:</strong> Numerical score indicating urgency</li>
              <li><strong>Response Level:</strong> Recommended response level</li>
            </ul>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

// Styles
const containerStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  justifyContent: "center",
  gap: "1rem",
  padding: "1.5rem",
  width: "100%",
};

const headerStyle: CSSProperties = {
  marginBottom: "5px",
  marginLeft: "5px",
  position: "relative",
  height: "40px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  textAlign: "center",
};

// const infoButtonStyle = {
//   cursor: "pointer",
//   marginLeft: "auto",
//   marginRight: "20px",
//   marginBottom: "auto",
//   padding: 0,
//   color: "blue",
//   hover: "transform: scale(1.5);",
//   color: "blue",
//   transition: "transform 0.3s ease",
//   transform: hovered ? "scale(1.5)" : "scale(1)",
// };

const cardStyle: CSSProperties = {
  maxWidth: "550px",
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  background: "#ccc",
  padding: "1rem",
  minHeight: "150px",
  justifyContent: "center",
  flexDirection: "column",
  display: "flex",
  // marginBottom: 'auto',
};
