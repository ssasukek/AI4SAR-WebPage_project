import { InputType } from "reactstrap/types/lib/Input";
import FormParser from "./FormParser";
import formsList from "./json/list.json";

export interface FormField {
  label?: string;
  name: string;
  type: InputType;
  placeholder?: string;
  required?: boolean;
  dynamic?: boolean;
  table?: boolean;
  dynamicTable?: boolean;
  columns?: TableColumn[];
  rows?: string[];
  subsection?: boolean;
  fields?: FormField[];
  heading?: string;
  columnHeading?: string;
  shortForm?: boolean;
  viewableBy?: string[];
  value?: string | number | boolean;
  values?: Record<string, any[]> | string[]; 
  min?: number;
  max?: number;
}

export interface TableColumn {
  name: string;
  type: string;
  placeholder?: string;
}

export interface FormSection {
  heading: string;
  fields: FormField[];
}

export interface GenericForm {
  key?: string;
  title?: string;
  sections: FormSection[];
  hasShortForm?: boolean; 
  photoURL?: string;
}

const getFormsList = () =>
  formsList.map((form) => ({
    key: form.split(".")[0],
    title: require(`./json/${form}`).title,
  }));

const Form = ({ name, initialFormState, photoURL }) => {
  console.log(
    "Form component: ",
    name,
    "is name",
    initialFormState,
    "is initial form state",
    photoURL,
    "is photoURL",
  );
  try {
    const formJSON = require(`./json/${name}.json`);
    return (
      <FormParser
        formJSON={formJSON}
        initialFormState={initialFormState}
        photoURL={photoURL}
      />
    );
  } catch (e) {
    return <div>Form not found</div>;
  }
};

export default Form;
export { getFormsList };
