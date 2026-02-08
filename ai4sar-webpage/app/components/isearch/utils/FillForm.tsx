const fillForm = (formState, submit, currentUser) => {
  console.log("Current user: ", currentUser);
  const timestamp = Date.now();
  const date = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
  formState["uid"] = currentUser.uid;
  formState["createdBy"] = currentUser.email;
  if (formState["author"] === undefined) {
    formState["author"] = [currentUser.displayName];
  } else if (!formState["author"].includes(currentUser.displayName)) {
    formState["author"].push(currentUser.displayName);
  }
  formState["timestamp"] = date;
  formState["submitted"] = submit;
  console.log(formState);
  return formState;
};

export default fillForm;
