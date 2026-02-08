"use client";
import React, { ReactNode, useReducer } from "react";
import { useParams } from "next/navigation";
import { useAllCluesOfIncident, Clue } from "../../../queries/IncidentQueries";
import filterAndSortReducer, {
  FilterAndSortState,
  FilterAndSortAction,
} from "../../../reducers/filterAndSortReducer";
import { Placeholder } from "reactstrap";
import { FilterAndSort, FilterButtonStyle } from "./FilterAndSort";
import { ClueCard } from "./ClueCard";

interface HeaderProps {
  children?: ReactNode;
}

/**
 * Children of this component will be placed in a
 * `position: relative` container, underneath the title of the pane
 */
const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div
      style={{
        marginBottom: "5px",
        position: "relative",
        height: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <b>Clues</b>
      {props.children}
    </div>
  );
};

const CluesPane: React.FC = () => {
  const params = useParams() as { incidentId: string };
  const allCluesQuery = useAllCluesOfIncident(params.incidentId);

  // stores currently selected filter/sort options
  const [filterAndSortSelections, dispatch] = useReducer(
    filterAndSortReducer,
    {
      sort: null,
      filters: {},
    }
  );

  // display this when we're still fetching data
  if (allCluesQuery.isLoading) {
    return (
      <div>
        <Header>
          {/* Button placeholder */}
          <Placeholder
            style={{
              ...FilterButtonStyle,
              borderRadius: "var(--bs-border-radius)",
              backgroundColor: "#6c757d",
            }}
          />
        </Header>

        {/* Placeholders for clues */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {[1, 2].map((i) => (
            <Placeholder
              animation="wave"
              key={i}
              style={{
                display: "block",
              }}
            >
              <Placeholder
                style={{
                  borderRadius: "var(--bs-border-radius)",
                  height: "150px",
                  backgroundColor: "white",
                }}
                xs={12}
              />
            </Placeholder>
          ))}
        </div>
      </div>
    );
  }

  // display this when there was a problem fetching the data,
  // and there's nothing cached to display alternatively
  if (allCluesQuery.isError) {
    return (
      <div>
        <Header />
        <b>Clues failed to fetch :(</b>
      </div>
    );
  }

  return (
    <div>
      <Header>
        <FilterAndSort
          setSortOption={(option) => dispatch({ type: "SET SORT", payload: option })}
          addSelectedFilter={(option) =>
            dispatch({ type: "ADD FILTER", payload: option })
          }
          removeSelectedFilter={(option) =>
            dispatch({ type: "REMOVE FILTER", payload: option })
          }
          uniqueTeamNames={[
            ...new Set(allCluesQuery.data.map((clue: Clue) => clue.team)),
          ]}
        />
      </Header>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {allCluesQuery.data.length === 0 && "No clues to display 📝"}
        {allCluesQuery.data
          .filter((clue: Clue) => {
            let pass = true;
            Object.keys(filterAndSortSelections.filters).forEach((key) => {
              const { fnc } = filterAndSortSelections.filters[key];
              pass = pass && fnc(clue);
            });
            return pass;
          })
          .toSorted((a: Clue, b: Clue) => {
            // use the sorting function if there is one selected
            // if not, don't do any sorting
            return filterAndSortSelections.sort?.fnc(a, b) ?? 1;
          })
          .map((clue: Clue, i: number) => (
            <ClueCard clue={clue} key={i} />
          ))}
      </div>
    </div>
  );
};

export default CluesPane;
