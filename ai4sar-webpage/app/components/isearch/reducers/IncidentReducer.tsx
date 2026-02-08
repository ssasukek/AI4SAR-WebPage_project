import { IncidentObject } from "../incident/IncidentCreation";

export type IncidentReducerAction =
  | { type: "SET FIELD"; payload: { field: string; value: string } }
  | { type: "SET STATE"; payload: IncidentObject }
  | { type: "HANDLE INPUT TEXT"; field: string; payload: string };

const incidentReducer = (
  state: IncidentObject,
  action: IncidentReducerAction,
): IncidentObject => {
  switch (action.type) {
    case "SET FIELD":
      console.log(
        "incidentReducer is prepopulating from ",
        state,
        "to",
        action.payload,
      );
      return { ...state, [action.payload.field]: action.payload.value };
    case "SET STATE":
      return action.payload;
    case "HANDLE INPUT TEXT":
      return {
        ...state,
        [action.field]: action.payload,
      };
    default:
      return state;
  }
};

export default incidentReducer;
