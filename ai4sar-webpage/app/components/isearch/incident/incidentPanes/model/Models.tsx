"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  InputSection,
  OutputSection,
  CustomCard,
  LoadingCard,
  ErrorCard,
  PredictCard,
  TotalManHoursPredictionCard,
  //GeospatialModelPredictionCard,
  //ResourceAllocationPredictionCard,
} from "./ModelCards";
import {
  useModelInput,
  useTotalManHoursModelInput,
  useReAlGeModelInput,
} from "../../../queries/ModelIncidentQueries";

interface ModelInputData {
  count: number;
  ageArray: number[];
  nameArray: string[];
}

interface TotalManHoursModelInputData {
  matchedSubjectCategories: string[];
  matchedSubjectActivities: string[];
  matchedWeatherConditions: string[];
  subjectAges: number[];
}

interface GroupBehaviorPrediction {
  wander: boolean;
}

// Query the inputs for the Wandered/Stayed Put model from the forms
// Send the inputs to the model and fetch the result
// Return the corresponding response pane
export const GroupBehaviorModel = () => {
  const [groupSize, setGroupSize] = useState<number>(0);
  const [ages, setAges] = useState<number[]>([]);
  const [subjectData, setSubjectData] = useState<{ name: string; age: number }[]>([]);
  const [result, setResult] = useState<string | GroupBehaviorPrediction>(
    "Not enough information provided to make prediction"
  );

  // query the submitted forms for relevant data
  const { incidentId } = useParams() as { incidentId: string };
  const { data, isLoading, isError } = useModelInput(incidentId);

  // Consolidate data setting logic into a single useEffect
  useEffect(() => {
    if (data?.ageArray?.length && data?.nameArray?.length) {
      setGroupSize(data.count);
      setAges(data.ageArray);
      setSubjectData(
        data.nameArray.map((name, index) => ({ name, age: data.ageArray[index] }))
      );
    }
  }, [data]);

  const fetchPrediction = useCallback(async () => {
    if (groupSize > 0 && ages.length > 0) {
      try {
        const response = await fetch(
          "https://wander-prediction-1-7dacb8bd514b.herokuapp.com/predict",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              groupSize,
              age: Math.floor(ages.reduce((a, b) => a + b, 0) / ages.length),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: GroupBehaviorPrediction = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Error during prediction:", error);
        setResult("Error getting prediction");
      }
    }
  }, [groupSize, ages]);

  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  const determineBehavior = () => {
    if (typeof result === "object" && "wander" in result) {
      return result.wander ? "Wandered" : "Stayed put";
    }
    return result;
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  if (isError) {
    return <ErrorCard />;
  }

  return (
    <PredictCard
      groupSize={groupSize}
      age={ages}
      behavior={determineBehavior()}
      subjectData={subjectData}
    />
  );
};

// Query the inputs for the Total Man Hours model from the forms
// Send the inputs to the model and fetch the result
// Return the corresponding response pane
export const TotalManHoursModel = () => {
  const [subjectCategory, setSubjectCategory] = useState<string>("No category detected");
  const [subjectActivity, setSubjectActivity] = useState<string>("No activity detected");
  const [weatherConditions, setWeatherConditions] = useState<string>(
    "No weather conditions detected"
  );
  const [age, setAge] = useState<number | string>("No age given");
  const [result, setResult] = useState<string | number>(
    "Not enough information provided to make prediction"
  );

  const { incidentId } = useParams() as { incidentId: string };
  const {
    data: totalManHoursModelData,
    isLoading,
    isError,
  } = useTotalManHoursModelInput(incidentId);

  // Consolidate data setting logic into a single useEffect
  useEffect(() => {
    if (totalManHoursModelData) {
      setSubjectCategory(
        totalManHoursModelData.matchedSubjectCategories[0] || "No category detected"
      );
      setSubjectActivity(
        totalManHoursModelData.matchedSubjectActivities[0] || "No activity detected"
      );
      setWeatherConditions(
        totalManHoursModelData.matchedWeatherConditions[0] || "No weather conditions detected"
      );
      setAge(totalManHoursModelData.subjectAges[0] || "No age given");
    }
  }, [totalManHoursModelData]);

  const fetchPrediction = useCallback(async () => {
    if (
      typeof age === "number" &&
      age >= 0 &&
      subjectCategory !== "No category detected" &&
      subjectActivity !== "No activity detected" &&
      weatherConditions !== "No weather conditions detected"
    ) {
      try {
        const response = await fetch(
          "https://totalmanhours-predictor-app-8e06a0cf78fb.herokuapp.com/predict",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              subject_category: subjectCategory,
              subject_activity: subjectActivity,
              weather: weatherConditions,
              age,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setResult(data.totalManHours);
      } catch (error) {
        console.error("Error during prediction:", error);
        setResult("Error getting prediction");
      }
    }
  }, [subjectCategory, subjectActivity, weatherConditions, age]);

  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  if (isLoading) {
    return <LoadingCard />;
  }

  if (isError) {
    return <ErrorCard />;
  }

  return (
    <TotalManHoursPredictionCard
      subjectCategory={subjectCategory}
      subjectActivity={subjectActivity}
      weatherConditions={weatherConditions}
      age={age}
      result={result}
    />
  );
};

// Query the inputs for the Geospatial model from the forms
// Send the inputs to the model and fetch the result
// Return the corresponding response pane
// NOT FINISHED, waiting on model to finish being implimented
export const GeospatialModel = () => {
  return (
    <CustomCard>coming soon...</CustomCard>
    // <GeospatialModelPredictionCard />
  );
};

// Query the inputs for the Resource Allocation model from the forms
// Send the inputs to the model and fetch the result
// Return the corresponding response pane
// NOT FINISHED, waiting on model to finish being implimented
export const ResourceAllocationModel = () => {
  return (
    <CustomCard>coming soon...</CustomCard>
    // <ResourceAllocationPredictionCard />
  );
};

// Second Wander Predictor Model
export const WanderPredictor2 = () => {
  const [groupSize, setGroupSize] = useState<number>(0);
  const [age, setAge] = useState<number>(0);
  const [result, setResult] = useState<string>(
    "Not enough information provided to make prediction"
  );

  const { incidentId } = useParams() as { incidentId: string };
  const { data, isLoading, isError } = useModelInput(incidentId);

  useEffect(() => {
    if (data?.ageArray?.length) {
      setGroupSize(data.count);
      setAge(Math.floor(data.ageArray.reduce((a, b) => a + b, 0) / data.ageArray.length));
    }
  }, [data]);

  const fetchPrediction = useCallback(async () => {
    if (groupSize > 0 && age >= 0) {
      try {
        const response = await fetch(
          "https://wander-prediction-1-7dacb8bd514b.herokuapp.com/predict",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
            },
            body: JSON.stringify({ groupSize, age }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setResult(
          data.wander === "True"
            ? "The subject wandered"
            : data.wander === "False"
            ? "The subject did not wander"
            : "Error interpreting prediction"
        );
      } catch (error) {
        console.error("Error during prediction:", error);
        setResult("Error getting prediction");
      }
    }
  }, [groupSize, age]);

  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  if (isLoading) {
    return <LoadingCard />;
  }

  if (isError) {
    return <ErrorCard />;
  }

  return (
    <PredictCard
      groupSize={groupSize}
      age={[age]}
      behavior={result}
      subjectData={[{ name: "Average Age", age }]}
    />
  );
};

// Priority Predictor Model
export const PriorityPredictor = () => {
  const [medicalCategory, setMedicalCategory] = useState<string>("Healthy");
  const [terrain, setTerrain] = useState<string>("Other");
  const [weather, setWeather] = useState<string>("Unknown");
  const [scenario, setScenario] = useState<string>("Unknown");
  const [ageGroup, setAgeGroup] = useState<string>("Other");
  const [experience, setExperience] = useState<string>("Good");
  const [equipment, setEquipment] = useState<string>("Good");
  const [clothing, setClothing] = useState<string>("Good");
  const [survivalTraining, setSurvivalTraining] = useState<string>("Good");
  const [result, setResult] = useState<{
    priority_score: number;
    response_level: string;
  }>({ priority_score: 0, response_level: "Not enough information provided to make prediction" });

  const fetchPrediction = useCallback(async () => {
    try {
      const response = await fetch(
        "https://sar-priority-predictor-1066029568dc.herokuapp.com/predict",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            medical_category: medicalCategory,
            terrain,
            weather,
            scenario,
            age_group: ageGroup,
            experience,
            equipment,
            clothing,
            survival_training: survivalTraining,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error during prediction:", error);
      setResult({ priority_score: 0, response_level: "Error getting prediction" });
    }
  }, [medicalCategory, terrain, weather, scenario, ageGroup, experience, equipment, clothing, survivalTraining]);

  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  return (
    <CustomCard>
      <InputSection>
        <div style={{ marginBottom: "10px" }}>
          <b>Medical Category: </b>
          <select value={medicalCategory} onChange={(e) => setMedicalCategory(e.target.value)}>
            {["Healthy", "Known or suspected ill or injured"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <b>Terrain: </b>
          <select value={terrain} onChange={(e) => setTerrain(e.target.value)}>
            {["Other", "Hazardous", "Not Hazardous"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <b>Weather: </b>
          <select value={weather} onChange={(e) => setWeather(e.target.value)}>
            {["Unknown", "Not Hazardous", "Predicted Hazardous", "Hazardous"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <b>Scenario: </b>
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            {[
              "Unknown",
              "Lost/Overdue",
              "Investigative",
              "Medical/Emotional",
              "Criminal/Evasion",
              "Emergency",
              "Medical",
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <b>Age Group: </b>
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
            {["Other", "Very Young", "Very Old"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <b>Experience: </b>
          <select value={experience} onChange={(e) => setExperience(e.target.value)}>
            {["Good", "Fair", "Poor", "Excellent"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <b>Equipment: </b>
          <select value={equipment} onChange={(e) => setEquipment(e.target.value)}>
            {["Good", "Fair", "Poor", "Excellent"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <b>Clothing: </b>
          <select value={clothing} onChange={(e) => setClothing(e.target.value)}>
            {["Good", "Fair", "Poor", "Excellent"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <b>Survival Training: </b>
          <select value={survivalTraining} onChange={(e) => setSurvivalTraining(e.target.value)}>
            {["Good", "Fair", "Poor", "Excellent"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </InputSection>
      <OutputSection>
        <div>
          <b>Priority Score: </b>
          {result.priority_score}
        </div>
        <div>
          <b>Response Level: </b>
          {result.response_level}
        </div>
      </OutputSection>
    </CustomCard>
  );
};
