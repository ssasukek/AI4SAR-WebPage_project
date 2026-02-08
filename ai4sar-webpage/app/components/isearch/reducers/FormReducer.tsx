import { connectScrollTo } from "react-instantsearch-dom";
import { FormField, FormSection, GenericForm } from "../forms/Form";

export interface FormReducerAction {
  type: string;
  payload?: any;
  indexList?: number[];
  index?: number;
  fieldName?: string;
  field?: FormField;
}

const formReducer = (state: GenericForm, action: FormReducerAction): GenericForm => {
  if (!action.type) {
    console.warn("formReducer was called without a defined action type");
    return state;
  }

  if (action.type === "PRE POPULATE") {
    let newState = { ...state };

    newState.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (action.payload[field.name]) {
          field.value = action.payload[field.name];
        }
      });
    });

    return newState;
  } else if (action.type === "SET STATE") {
    return action.payload;
  } else {
    let newState = { ...state };
    // copy root section
    newState.sections[action.indexList![0]] = {
      ...newState.sections[action.indexList![0]],
    };
    // assign field pointer to root section
    let field: FormSection | FormField = newState.sections[action.indexList![0]];
    // go through recursive fields arrays
    for (let i = 1; i < action.indexList!.length; i++) {
      if ("fields" in field && field.fields) {
        // copy recursive subfield
        field.fields[action.indexList![i]] = {
          ...field.fields[action.indexList![i]],
        };
        // reassign field pointer to subfield
        field = field.fields[action.indexList![i]];
      }
    }
    switch (action.type) {
      case "HANDLE INPUT TEXT":
        if ("value" in field) field.value = action.payload;
        break;
      case "HANDLE DYNAMIC TEXT":
        if ("values" in field && Array.isArray(field.values)) {
          field.values[action.index!] = action.payload;
        }
        break;
      case "ADD NEW FIELD":
        if ("values" in field && Array.isArray(field.values)) {
          field.values.push(action.payload);
        }
        break;
      case "ADD NEW TABLE FIELD":
        if ("values" in field && field.values && "rows" in field && field.rows) {
          for (const key in field.values) {
            if (Array.isArray(field.values[key])) {
              field.values[key].push("");
            }
          }
          field.rows.push(String(field.rows.length + 1));
        }
        break;
      case "REMOVE FIELD":
        if ("values" in field && Array.isArray(field.values)) {
          field.values = field.values.filter((_, i) => i !== action.index);
        }
        break;
      case "HANDLE DYNAMIC TABLE TEXT":
        if ("values" in field && field.values && action.fieldName) {
          if (field.dynamicTable && Array.isArray(field.values[action.fieldName])) {
            field.values[action.fieldName][action.index!] = action.payload;
          } else {
            field.values[action.fieldName] = action.payload;
          }
        }
        break;
      case "HANDLE TABLE TEXT":
        if ("values" in field && action.fieldName) {
          field.values[action.fieldName] = action.payload;
        }
        break;
      case "HANDLE PHOTO UPLOAD":
        const { payload } = action;
        let updatedState = { ...state, photoURL: payload };
        return updatedState;
      default:
        return state;
    }
    return newState;
  }
};

export default formReducer;
