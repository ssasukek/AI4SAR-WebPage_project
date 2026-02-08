import { Button } from "reactstrap";

let online = navigator.onLine;

const Submission = ({ initialFormState, setSubmit }) => {
  return (
    <footer
      className="fixed-bottom"
      style={{
        position: "sticky",
        maxHeight: "400px",
        padding: "10px 0px",
        backgroundColor: "#F0EEE8",
        marginTop: "calc(1vh + 1rem)",
        display: "flex",
        justifyContent: "space-between",
        zIndex: "0",
      }}
    >
      <Button
        disabled={
          !online ? true : initialFormState ? initialFormState.submitted : false
        }
        type="submit"
        style={{ background: "#00563A" }}
        onClick={() => setSubmit(false)}
      >
        Save Initial Copy to Device
      </Button>
      <Button
        type="submit"
        style={{ background: "#006CF5" }}
        disabled={!online}
        onClick={() => setSubmit(true)}
      >
        {initialFormState
          ? initialFormState.submitted
            ? "Resubmit to Command Post"
            : "Submit to Command Post"
          : "Submit to Command Post"}
      </Button>
    </footer>
  );
};

export default Submission;
