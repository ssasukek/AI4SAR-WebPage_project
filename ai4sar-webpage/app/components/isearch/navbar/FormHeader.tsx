import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import {
  Navbar,
  NavbarToggler,
  Collapse,
  NavItem,
  NavLink,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  Button,
  Tooltip,
} from "reactstrap";

interface FormHeaderProps {
  incidentId: string;
}

interface IncidentData {
  incidentName?: string;
  [key: string]: any;
}

const FormHeader: React.FC<FormHeaderProps> = ({ incidentId }) => {
  const [incident, setIncident] = useState<IncidentData>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [operationNumber, setOperationNumber] = useState<string>("");

  const toggle = () => setTooltipOpen(!tooltipOpen);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "incidents", incidentId), (doc) => {
      setIncident(doc.data() as IncidentData);
    });
    return () => unsubscribe();
  }, [incidentId]);

  useEffect(() => {
    const operationNumber = window.location.pathname.split("/")[2]; // Updated to use `window.location`
    setOperationNumber(operationNumber);
  }, []);

  return (
    <div>
      <Navbar
        style={{ background: "#00563A" }}
        background="00563A"
        container="sm"
        dark
        fixed="top"
        light
      >
        <NavbarBrand style={{ color: "white" }} href="/private/incidents">
          IntelliSAR
        </NavbarBrand>

        {/* CODE THAT WAS ADDED START*/}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            listStyleType: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle
              caret
              nav
              style={{ color: "white", padding: "0 15px 0 0" }}
            >
              All Forms
            </DropdownToggle>
            <DropdownMenu
              style={{
                maxHeight: "300px", // Limit height
                overflowY: "scroll", // Enable scrolling
                scrollbarWidth: "thin", // For Firefox
                msOverflowStyle: "auto", // For Internet Explorer
                boxShadow:
                  "inset 0px 10px 8px -10px rgba(0, 0, 0, 0.3), inset 0px -10px 8px -10px rgba(0, 0, 0, 0.3)", // Indicate scrollability
              }}
            >
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar100`)
                }
              >
                General Briefing - Generic Incident (SAR 100)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar100a`)
                }
              >
                General Briefing - Missing Person (SAR 100A)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar104`)
                }
              >
                Team Assignment (SAR 104)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar110`)
                }
              >
                Team Debriefing (SAR 110)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar111`)
                }
              >
                Team Debriefing - Dog Supplement(SAR 111)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar112`)
                }
              >
                Team Debriefing - Area Search Supplement (SAR 112)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar115`)
                }
              >
                Team Debriefing - Tracking Team Supplement (SAR 115)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar116`)
                }
              >
                Team Debriefing - Hasty Search Supplement (SAR 116)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar119`)
                }
              >
                Team Debriefing Supplement (SAR 119)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar131`)
                }
              >
                Individual Availability Assignment (SAR 131)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${incidentId}/sar132`)
                }
              >
                Urban Interview Log (SAR 132)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar133`)
                }
              >
                Radio Log (SAR 133)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar134`)
                }
              >
                Clue Log (SAR 134)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar135`)
                }
              >
                Clue Report (SAR 135)
              </DropdownItem>
              {/* <DropdownItem onClick={() => router.push(`/private/incidents/${operationNumber}/ics202`)}>
                                    Incident Objectives (ICS 202)
                                </DropdownItem> */}
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics204`)
                }
              >
                Assignment List (ICS 204)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics205`)
                }
              >
                Incident Radio Communications Plan (ICS 205)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics206`)
                }
              >
                Medical Plan (ICS 206)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics211a`)
                }
              >
                Agency Check In List (ICS 211A)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics211b`)
                }
              >
                Check In List (ICS 211B)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics214`)
                }
              >
                Unit Log (ICS 214)
              </DropdownItem>
              {/* <DropdownItem onClick={() => router.push(`/private/incidents/${operationNumber}/ics202`)}>
                                     Incident Objectives (ICS 202)
                                </DropdownItem> */}
              <DropdownItem
                onClick={() =>
                  router.push(
                    `/private/incidents/${operationNumber}/missingperson`,
                  )
                }
              >
                Missing Person Questionnaire
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle
              caret
              nav
              style={{ color: "white", padding: "0 15px 0 0" }}
            >
              Check-in and Briefing
            </DropdownToggle>
            <DropdownMenu
              style={{
                maxHeight: "300px", // Limit height
                overflowY: "scroll", // Enable scrolling
                scrollbarWidth: "thin", // For Firefox
                msOverflowStyle: "auto", // For Internet Explorer
                boxShadow:
                  "inset 0px 10px 8px -10px rgba(0, 0, 0, 0.3), inset 0px -10px 8px -10px rgba(0, 0, 0, 0.3)", // Indicate scrollability
              }}
            >
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar100`)
                }
              >
                General Briefing - Generic Incident (SAR 100)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar100a`)
                }
              >
                General Briefing - Missing Person (SAR 100A)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar131`)
                }
              >
                Individual Availability Assignment (SAR 131)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics211a`)
                }
              >
                Agency Check In List (ICS 211A)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics211b`)
                }
              >
                Check In List (ICS 211B)
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle
              caret
              nav
              style={{ color: "white", padding: "0 15px 0 0" }}
            >
              Assignment
            </DropdownToggle>
            <DropdownMenu
              style={{
                maxHeight: "300px", // Limit height
                overflowY: "scroll", // Enable scrolling
                scrollbarWidth: "thin", // For Firefox
                msOverflowStyle: "auto", // For Internet Explorer
                boxShadow:
                  "inset 0px 10px 8px -10px rgba(0, 0, 0, 0.3), inset 0px -10px 8px -10px rgba(0, 0, 0, 0.3)", // Indicate scrollability
              }}
            >
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar104`)
                }
              >
                Team Assignment (SAR 104)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics204`)
                }
              >
                Assignment List (ICS 204)
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle
              caret
              nav
              style={{ color: "white", padding: "0 15px 0 0" }}
            >
              Debriefing
            </DropdownToggle>
            <DropdownMenu
              style={{
                maxHeight: "300px", // Limit height
                overflowY: "scroll", // Enable scrolling
                scrollbarWidth: "thin", // For Firefox
                msOverflowStyle: "auto", // For Internet Explorer
                boxShadow:
                  "inset 0px 10px 8px -10px rgba(0, 0, 0, 0.3), inset 0px -10px 8px -10px rgba(0, 0, 0, 0.3)", // Indicate scrollability
              }}
            >
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar110`)
                }
              >
                Team Debriefing (SAR 110)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar111`)
                }
              >
                Team Debriefing - Dog Supplement(SAR 111)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar112`)
                }
              >
                Team Debriefing - Area Search Supplement (SAR 112)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar113`)
                }
              >
                Team Debriefing - Equestrian Supplement (SAR 113)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar115`)
                }
              >
                Team Debriefing - Tracking Team Supplement (SAR 115)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar116`)
                }
              >
                Team Debriefing - Hasty Search Supplement (SAR 116)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar119`)
                }
              >
                Team Debriefing Supplement (SAR 119)
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle
              caret
              nav
              style={{ color: "white", padding: "0 15px 0 0" }}
            >
              Clues
            </DropdownToggle>
            <DropdownMenu
              style={{
                maxHeight: "300px", // Limit height
                overflowY: "scroll", // Enable scrolling
                scrollbarWidth: "thin", // For Firefox
                msOverflowStyle: "auto", // For Internet Explorer
                boxShadow:
                  "inset 0px 10px 8px -10px rgba(0, 0, 0, 0.3), inset 0px -10px 8px -10px rgba(0, 0, 0, 0.3)", // Indicate scrollability
              }}
            >
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar132`)
                }
              >
                Urban Interview Log (SAR 132)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar134`)
                }
              >
                Clue Log (SAR 134)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar135`)
                }
              >
                Clue Report (SAR 135)
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle
              caret
              nav
              style={{ color: "white", padding: "0 15px 0 0" }}
            >
              ICS
            </DropdownToggle>
            <DropdownMenu
              style={{
                maxHeight: "300px", // Limit height
                overflowY: "scroll", // Enable scrolling
                scrollbarWidth: "thin", // For Firefox
                msOverflowStyle: "auto", // For Internet Explorer
                boxShadow:
                  "inset 0px 10px 8px -10px rgba(0, 0, 0, 0.3), inset 0px -10px 8px -10px rgba(0, 0, 0, 0.3)", // Indicate scrollability
              }}
            >
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics204`)
                }
              >
                Assignment List (ICS 204)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics205`)
                }
              >
                Incident Radio Communications Plan (ICS 205)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics206`)
                }
              >
                Medical Plan (ICS 206)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics211a`)
                }
              >
                Agency Check In List (ICS 211A)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics211b`)
                }
              >
                Check In List (ICS 211B)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics214`)
                }
              >
                Unit Log (ICS 214)
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle
              caret
              nav
              style={{ color: "white", padding: "0 15px 0 0" }}
            >
              Radio
            </DropdownToggle>
            <DropdownMenu
              style={{
                maxHeight: "300px", // Limit height
                overflowY: "scroll", // Enable scrolling
                scrollbarWidth: "thin", // For Firefox
                msOverflowStyle: "auto", // For Internet Explorer
                boxShadow:
                  "inset 0px 10px 8px -10px rgba(0, 0, 0, 0.3), inset 0px -10px 8px -10px rgba(0, 0, 0, 0.3)", // Indicate scrollability
              }}
            >
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/sar133`)
                }
              >
                Radio Log (SAR 133)
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push(`/private/incidents/${operationNumber}/ics205`)
                }
              >
                Incident Radio Communications Plan (ICS 205)
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle
              caret
              nav
              style={{ color: "white", padding: "0 15px 0 0" }}
            >
              Missing Person Questionnaire
            </DropdownToggle>
            <DropdownMenu
              style={{
                maxHeight: "300px", // Limit height
                overflowY: "scroll", // Enable scrolling
                scrollbarWidth: "thin", // For Firefox
                msOverflowStyle: "auto", // For Internet Explorer
                boxShadow:
                  "inset 0px 10px 8px -10px rgba(0, 0, 0, 0.3), inset 0px -10px 8px -10px rgba(0, 0, 0, 0.3)", // Indicate scrollability
              }}
            >
              <DropdownItem
                onClick={() =>
                  router.push(
                    `/private/incidents/${operationNumber}/missingperson`,
                  )
                }
              >
                Missing Person Questionnaire
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>

        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink href="https://github.com/iSearch-CalPoly/frontend">
                GitHub (For Testing Purposes)
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};
export default FormHeader;
