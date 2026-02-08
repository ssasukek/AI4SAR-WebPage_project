"use client";
import React, { useState, CSSProperties } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Modal, Row } from "reactstrap";
import { FaFilter, FaCheck, FaUndo } from "react-icons/fa";

interface SortOption {
  id: string;
  name: string;
  fnc: (a: Record<string, any>, b: Record<string, any>) => number;
}

interface FilterAndSortProps {
  setSortOption: (option: SortOption | null) => void;
  addSelectedFilter: (filter: {
    id: string;
    name?: string;
    fnc: (clue: any) => boolean;
  }) => void;
  removeSelectedFilter: (filter: { id: string }) => void;
  uniqueTeamNames: string[];
}

const SortOptions: SortOption[] = [
  {
    id: "alphabetical",
    name: "Alphabetical",
    fnc: (a, b) => a["item found"].localeCompare(b["item found"]),
  },
  {
    id: "alphabetical_reverse",
    name: "Reverse Alphabetical",
    fnc: (a, b) => -1 * a["item found"].localeCompare(b["item found"]),
  },
  {
    id: "most_recent",
    name: "Most Recent",
    fnc: (a, b) => b["date"].localeCompare(a["date"]),
  },
];

export const FilterAndSort: React.FC<FilterAndSortProps> = ({
  setSortOption,
  addSelectedFilter,
  removeSelectedFilter,
  uniqueTeamNames,
}) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null);
  const [selectedFoundBeforeDate, setSelectedFoundBeforeDate] = useState<string>("");
  const [selectedFoundAfterDate, setSelectedFoundAfterDate] = useState<string>("");
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());

  const handleClose = () => {
    if (selectedTeams.size === 0) {
      removeSelectedFilter({ id: "teams" });
    } else {
      addSelectedFilter({
        id: "teams",
        name: "Teams",
        fnc: (clue) => selectedTeams.has(clue.team),
      });
    }

    if (selectedFoundBeforeDate === "") {
      removeSelectedFilter({ id: "found_before" });
    } else {
      addSelectedFilter({
        id: "found_before",
        fnc: (clue) => clue["date"].localeCompare(selectedFoundBeforeDate) < 0,
      });
    }

    if (selectedFoundAfterDate === "") {
      removeSelectedFilter({ id: "found_after" });
    } else {
      addSelectedFilter({
        id: "found_after",
        fnc: (clue) => clue["date"].localeCompare(selectedFoundAfterDate) > 0,
      });
    }

    setSortOption(selectedSort);
    setOpen(false);
  };

  const resetAll = () => {
    setSelectedTeams(new Set());
    setSelectedFoundAfterDate("");
    setSelectedFoundBeforeDate("");
    setSelectedSort(null);
  };

  return (
    <>
      <Modal isOpen={open} toggle={toggle}>
        <Form style={{ margin: "10px 0", padding: "1rem" }}>
          <FormGroup tag="fieldset">
            {/* One column on small devices, 2 on larger */}
            <Col>
              <legend>Sort by</legend>
            </Col>
            <Row xs={1} md={2}>
              <Col>
                {SortOptions.map((option) => (
                  <FormGroup check key={option.id}>
                    <Input
                      id={option.id}
                      checked={option.id === selectedSort?.id}
                      name={`sort-${option.id}`}
                      type="radio"
                      onChange={() => {
                        setSelectedSort(option);
                      }}
                    />{" "}
                    <Label check for={option.id}>
                      {option.name}
                    </Label>
                  </FormGroup>
                ))}
              </Col>
            </Row>
          </FormGroup>

          <FormGroup tag="fieldset">
            {/* One column on small devices, 2 on larger */}
            <Col>
              <legend>Filters</legend>
            </Col>
            <Row xs={1} md={2}>
              <Col>
                <FormGroup>
                  Found Before
                  <Input
                    type="date"
                    value={selectedFoundBeforeDate}
                    onChange={(e) => {
                      setSelectedFoundBeforeDate(e.target.value ?? "");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  Found After
                  <Input
                    type="date"
                    value={selectedFoundAfterDate}
                    onChange={(e) => {
                      setSelectedFoundAfterDate(e.target.value ?? "");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  Teams
                  {uniqueTeamNames.toSorted().map((name, i) => (
                    <FormGroup
                      key={i}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Input
                        style={{ marginRight: "10px" }}
                        type="checkbox"
                        checked={selectedTeams.has(name)}
                        onChange={(e) => {
                          let newTeams = new Set(selectedTeams);
                          if (e.target.checked) {
                            newTeams = newTeams.add(name);
                          } else {
                            newTeams.delete(name);
                          }

                          setSelectedTeams(newTeams);
                        }}
                      />
                      {name}
                    </FormGroup>
                  ))}
                </FormGroup>
              </Col>
            </Row>
          </FormGroup>

          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={() => handleClose()}
              style={{ display: "flex", gap: "5px", alignItems: "center" }}
            >
              <FaCheck />
              Done
            </Button>
            <Button
              outline
              onClick={() => resetAll()}
              style={{ display: "flex", gap: "5px", alignItems: "center" }}
            >
              <FaUndo style={{ marginRight: "5px" }} />
              Reset all filters
            </Button>
          </div>
        </Form>
      </Modal>

      <Button style={FilterButtonStyle} onClick={() => setOpen(!open)}>
        <FaFilter />
      </Button>
    </>
  );
};

export const FilterButtonStyle: CSSProperties = {
  height: "40px",
  width: "42px",
  position: "absolute",
  right: "1px",
  zIndex: "10",
};
