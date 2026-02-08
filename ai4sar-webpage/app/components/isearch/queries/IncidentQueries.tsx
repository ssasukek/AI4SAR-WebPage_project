import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../Firebase-config";
import { useQuery } from "@tanstack/react-query";

export interface Clue {
  itemFound: string;
  latOfFind: number;
  longOfFind: number;
  date: string;
  time: string;
  team: string;
  initials: string;
}

export interface TimelineInfo {
  lastSeen: string;
  timeSince: string;
  reportedMissing: string;
  sarArrived: string[];
}

export interface Resource {
  agency: string;
  headcount: number;
  agencyResources: { resourceName: string; signedIn: boolean }[];
}

export interface PointLastSeen {
  latitude: number;
  longitude: number;
}

/**
 * Returns a query object for all clues of an incident.
 * @param {string} incidentId
 * @returns a query for an array of the clues of the incident. The `data` field contains the array of JSON objects, each contains things like `item found` and `lat of find`, etc.
 */
export const useAllCluesOfIncident = (incidentId: string) => {
  return useQuery<Clue[]>({
    queryKey: ["incidents", incidentId, "forms", "sar134"],
    queryFn: async () => {
      const cluesCollectionRef = collection(db, "incidents", incidentId, "forms");
      const cluesQuery = query(cluesCollectionRef, where("key", "==", "sar134"));

      const formSubmissions = (await getDocs(cluesQuery)).docs;
      const allClues: Clue[] = [];
      formSubmissions.forEach((doc) => {
        const sar134Submission = doc.data().sections[1];
        const cluesColumns = sar134Submission.fields[0].columns;
        const cluesValues = sar134Submission.fields[0].values;

        sar134Submission.fields[0].rows.forEach((strRowNum: string) => {
          const rowNum = +strRowNum - 1;
          const newObj: Partial<Record<keyof Clue, any>> = {};
          cluesColumns.forEach(({ name }: { name: string }) => {
            newObj[name.toLowerCase() as keyof Clue] = cluesValues[name.toLowerCase()]?.[rowNum];
          });
          allClues.push(newObj as Clue);
        });
      });
      return allClues;
    },
  });
};

/**
 * Returns a query object for all Timeline Information of an incident.
 * @param {string} incidentId
 * @returns a query for an object containing timeline information such as `lastSeen`, `timeSince`, `reportedMissing`, and `sarArrived`.
 */
export const useAllTimesOfIncident = (incidentId: string) => {
  return useQuery<TimelineInfo>({
    queryKey: ["incidents", incidentId, "timeline"],
    queryFn: async () => {
      //get incident document to access created timestamp
      const incidentRef = doc(db, "incidents", incidentId);
      const reportedMissing = await getDoc(incidentRef);

      //query forms for given incident for missingperson form with last seen date and time
      const timelineCollectionRef = collection(db, "incidents", incidentId, "forms");
      const mpqQuery = query(
        timelineCollectionRef,
        where("key", "==", "missingperson"),
      );

      const mpqQueryResults = await getDocs(mpqQuery);
      let lastSeenInfo: QueryDocumentSnapshot | undefined = mpqQueryResults.docs[0];

      mpqQueryResults.forEach((doc) => {
        if (doc.data()["submitted"] === true) {
          if (
            doc.data().sections[7].fields[2].value &&
            doc.data().sections[7].fields[3].value
          ) {
            lastSeenInfo = doc;
          }
        }
      });

      //query forms for given incident for ics211a form with sar agencies that responded
      const agencyQuery = query(timelineCollectionRef, where("key", "==", "ics211a"));
      const sarAgenciesArrived = (await getDocs(agencyQuery)).docs;

      const newObj: TimelineInfo = {
        lastSeen: "Unknown",
        timeSince: "Unknown",
        reportedMissing: "Unknown",
        sarArrived: ["No agencies have arrived yet."],
      };

      if (lastSeenInfo) {
        const lastSeenDate = lastSeenInfo.data().sections[7].fields[2].value;
        const lastSeenTime = lastSeenInfo.data().sections[7].fields[3].value;

        if (lastSeenDate || lastSeenTime) {
          newObj.lastSeen = `${lastSeenDate}, ${lastSeenTime}`;
        }

        //calculate difference between now and last seen datetime
        const nowDate = new Date();
        const date = new Date(newObj.lastSeen);

        const microsecondDiff = nowDate.getTime() - date.getTime();
        const dayDiff = Math.floor(microsecondDiff / (1000 * 60 * 60 * 24));
        const hourDiff = Math.floor(microsecondDiff / (1000 * 60 * 60) - dayDiff * 24);
        const minuteDiff = Math.floor(
          microsecondDiff / (1000 * 60) - dayDiff * 24 * 60 - hourDiff * 60,
        );

        newObj.timeSince = `${dayDiff}d ${hourDiff}hr ${minuteDiff}min`;
      }

      if (reportedMissing.exists()) {
        const reportedMissingDate = reportedMissing.data()["incidentDatePrepared"];
        const reportedMissingTime = reportedMissing.data()["incidentTimePrepared"];

        if (reportedMissingDate || reportedMissingTime) {
          newObj.reportedMissing = `${reportedMissingDate}, ${reportedMissingTime}`;
        }
      }

      if (sarAgenciesArrived.length > 0) {
        newObj.sarArrived = sarAgenciesArrived.map(
          (doc) => doc.data().sections[1].fields[0].value,
        );
      }

      return newObj;
    },
  });
};

/**
 * Returns a query object for all resources involved with an incident.
 * @param {string} incidentId
 * @returns a query for an array of all the resources involved with an incident.
 * The `data` field contains the array of JSON objects containing the agency name and its respective headcount.
 * See `formReducer.js` for format.
 */
export const useAllResourcesOfIncident = (incidentId: string) => {
  return useQuery<Resource[]>({
    queryKey: ["incidents", incidentId, "forms", "ics211a"],
    queryFn: async () => {
      const ResourcesCollectionRef = collection(db, "incidents", incidentId, "forms");
      const ResourcesQuery = query(
        ResourcesCollectionRef,
        where("key", "==", "ics211a"),
      );

      const formSubmissions = (await getDocs(ResourcesQuery)).docs;
      const allResources: Resource[] = [];
      const date = new Date();
      const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      const currentTime = `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      formSubmissions.forEach((doc) => {
        //form data from the ics204 form
        const ics204Submission = doc.data();
        let agency = ics204Submission.sections[1].fields[0].value || "No Name Given";

        const arr = doc.data().sections[2].fields[0].values;
        const arrNameDesc = arr["name (personnel) - or - description (equipment)"];
        const arrDateOut = arr["date out"];
        const arrTimeOut = arr["time out"];
        const agencyResources: { resourceName: string; signedIn: boolean }[] = [];
        let headcount = 0;
        /*add to the head count only if the there is no date out and if the resource
        has a description*/
        for (
          let index = 0;
          index < doc.data().sections[2].fields[0].rows.length;
          index++
        ) {
          if (arrNameDesc[index] === "") {
            continue;
          } else if (arrDateOut[index] !== "") {
            if (
              currentDate > arrDateOut[index] ||
              (arrTimeOut[index] !== "" &&
                currentDate === arrDateOut[index] &&
                currentTime > arrTimeOut[index])
            ) {
              agencyResources.push({
                resourceName: arrNameDesc[index],
                signedIn: false,
              });
            } else {
              agencyResources.push({
                resourceName: arrNameDesc[index],
                signedIn: true,
              });
              headcount++;
            }
          } else {
            agencyResources.push({
              resourceName: arrNameDesc[index],
              signedIn: true,
            });
            headcount++;
          }
        }
        //add a JSON object containing the agency and headcount to the allResources array
        allResources.push({
          agency,
          headcount,
          agencyResources,
        });
      });

      return allResources;
    },
  });
};

/**
 * Returns a query object for the point last seen of an incident based on incidentId.
 * @param {string} incidentId
 * @returns a query for the point last seen of the incident.
 */
export const usePointLastSeen = (incidentId: string) => {
  return useQuery<PointLastSeen>({
    queryKey: ["incidents", incidentId],
    queryFn: async () => {
      // Reference to the specific incident document with only the required fields
      const incidentDocRef = doc(db, "incidents", incidentId);

      // Fetching only the missingPersonPlsLatitude and missingPersonPlsLongitude fields
      const incidentDocSnap = await getDoc(incidentDocRef);

      if (incidentDocSnap.exists()) {
        const data = incidentDocSnap.data();
        if (data.missingPersonPlsLatitude && data.missingPersonPlsLongitude) {
          return {
            latitude: data.missingPersonPlsLatitude,
            longitude: data.missingPersonPlsLongitude,
          };
        } else {
          throw new Error("Latitude and/or Longitude not found");
        }
      } else {
        throw new Error("Incident not found");
      }
    },
  });
};
