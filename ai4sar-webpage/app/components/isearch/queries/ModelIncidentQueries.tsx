import { collection, getDocs, query, where, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { FormSection, FormField } from "../forms/Form";

interface GroupBehaviorModelResult {
  count: number;
  ageArray: number[];
  nameArray: string[];
}

interface TotalManHoursModelResult {
  matchedSubjectCategories: string[];
  matchedSubjectActivities: string[];
  matchedWeatherConditions: string[];
  subjectAges: number[];
}

// Returns a query object for all needed inputs for the Group Behavior prediction model
// queries for the following inputs: subject age(s) and names
export const useModelInput = (incidentId: string) => {
  return useQuery<GroupBehaviorModelResult>({
    queryKey: ["incidents", incidentId, "forms", "sar100a"],
    queryFn: async () => {
      const formCollectionRef = collection(db, "incidents", incidentId, "forms");
      const sar100aQuery = query(formCollectionRef, where("key", "==", "sar100a"));
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(sar100aQuery);
      const formDocs = querySnapshot.docs;

      const ageArray: number[] = [];
      const nameArray: string[] = [];

      formDocs.forEach((doc) => {
        const submissionData = doc.data();
        const subjectInfoSection = submissionData.sections.find(
          (section: FormSection) => section.heading === "Subject Info",
        );

        if (subjectInfoSection) {
          const ageField = subjectInfoSection.fields.find(
            (field: FormField) => field.label === "Age",
          );
          const nameField = subjectInfoSection.fields.find(
            (field: FormField) => field.label === "Subject Name",
          );
          if (ageField?.value) {
            ageArray.push(parseInt(ageField.value as string, 10));
          }

          if (nameField?.value) {
            nameArray.push(nameField.value as string);
          }
        }
      });

      const count = ageArray.length;
      console.log("Group Behavior Model query results:", count, ageArray, nameArray);
      return { count, ageArray, nameArray };
    },
  });
};

// Returns a query object for all needed inputs for the Total Man Hours prediction model
// queries for the following inputs: subject category, subject activity, weather, subject age
export const useTotalManHoursModelInput = (incidentId: string) => {
  const subjectCategoryUniqueValues: string[] = [
    "Child",
    "Dementia",
    "Substance Intoxication",
    "Youth",
    "Autistic",
    "Hiker",
    "Hunter",
    "Climber",
    "Despondent",
    "Aircraft",
    "Angler",
    "Worker",
    "Vehicle",
    "Snowboarder",
    "Boater",
    "Mental Illness",
    "Runner",
    "Caver",
    "Intellectual Disability",
    "Extreme Sports",
    "Gatherer",
    "Abduction",
    "Motorcycle",
    "Skier-Nordic",
    "Vehicle-4wd",
    "Skier-Alpine",
    "ATV",
    "Aircraft-nonpowered",
    "Camper",
    "Horseback Rider",
    "Runaway",
    "Walkaway",
  ];
  const subjectActivityUniqueValues: string[] = [
    "Playing",
    "Walkaway",
    "Drinking",
    "Tramping",
    "Hunting",
    "Climbing",
    "Hiking",
    "Flying",
    "Fishing",
    "Working",
    "Driving",
    "Snowboarding",
    "Boating",
    "Runaway",
    "Running",
    "Biking",
    "Rafting",
    "Caving",
    "Mushroom Hunting",
    "Gathering",
    "Other",
    "playing",
    "Skiing",
    "fishing",
    "hiking",
    "drugs",
    "Extreme Sports",
    "School",
    "Camping",
    "hiding",
    "Criminal",
    "hunting",
    "outing",
    "Riding",
    "Swimming",
  ];
  const weatherUniqueValues: string[] = [
    "Clear",
    "Rain",
    "Overcast",
    "Foggy",
    "Snow",
    "Hail",
    "Cloudy",
    "Partly cloudy",
    "Thunderstorm",
    "Partly Cloudy",
    "Drizzle",
    "Showers",
    "Sleet",
  ];
  const subjectAges: number[] = [];

  const findMatchingKeywords = (fieldValue: string, keywords: string[]): string[] => {
    const lowerCaseFieldValue = fieldValue.toLowerCase();
    return keywords.filter((keyword) =>
      lowerCaseFieldValue.includes(keyword.toLowerCase()),
    );
  };

  return useQuery<TotalManHoursModelResult>({
    queryKey: [incidentId],
    queryFn: async () => {
      const formCollectionRef = collection(db, "incidents", incidentId, "forms");
      const missingPersonQuestionnaireQuery = query(
        formCollectionRef,
        where("key", "==", "missingperson"),
      );
      const sar100aQuestionnaireQuery = query(
        formCollectionRef,
        where("key", "==", "sar100a"),
      );
      const missingPersonQuerySnapshot: QuerySnapshot<DocumentData> = await getDocs(missingPersonQuestionnaireQuery);
      const sar100aQuerySnapshot: QuerySnapshot<DocumentData> = await getDocs(sar100aQuestionnaireQuery);

      const matchedSubjectCategories = new Set<string>();
      const matchedSubjectActivities = new Set<string>();
      const matchedWeatherConditions = new Set<string>();

      // pull the corresponding categories, activities, and weather conditions
      missingPersonQuerySnapshot.docs.forEach((doc) => {
        const formData = doc.data();
        console.log("Form Data: ", formData);

        // Find the "Summary of Events" section
        const summarySection = formData.sections.find(
          (section: FormSection) =>
            section.heading ===
            "Summary of Events Leading Up To and Following MP's Disappearance",
        );

        if (summarySection) {
          console.log("Summary of Events section found");

          // Find the "Prior Events" subsection within the "Summary of Events" section
          const priorEventsSubsection = summarySection.fields.find(
            (field: FormField) => field.heading === "Prior Events" && field.subsection,
          );

          if (priorEventsSubsection) {
            console.log("Prior Events subsection found");

            // Find the specific field "Describe prior events. Where was MP located last time?"
            const priorEventsField = priorEventsSubsection.fields?.find(
              (field: FormField) =>
                field.label === "Describe prior events. Where was MP located last time?",
            );

            if (priorEventsField?.value) {
              const fieldValue = priorEventsField.value as string;
              console.log("Field value: ", fieldValue);

              const subjectCategories = findMatchingKeywords(
                fieldValue,
                subjectCategoryUniqueValues,
              );
              subjectCategories.forEach((keyword) =>
                matchedSubjectCategories.add(keyword),
              );

              const subjectActivities = findMatchingKeywords(
                fieldValue,
                subjectActivityUniqueValues,
              );
              subjectActivities.forEach((keyword) =>
                matchedSubjectActivities.add(keyword),
              );

              const weatherConditions = findMatchingKeywords(
                fieldValue,
                weatherUniqueValues,
              );
              weatherConditions.forEach((keyword) =>
                matchedWeatherConditions.add(keyword),
              );
            } else {
              console.log("Prior Events field not found or value missing");
            }
          } else {
            console.log("Prior Events subsection not found");
          }
        } else {
          console.log("Summary of Events section not found");
        }
      });

      // pull the ages
      sar100aQuerySnapshot.forEach((doc) => {
        const formData = doc.data();
        const subjectInfoSection = formData.sections.find(
          (section: FormSection) => section.heading === "Subject Info",
        );
        if (subjectInfoSection) {
          const ageField = subjectInfoSection.fields.find(
            (field: FormField) => field.label === "Age",
          );

          if (ageField?.value) {
            subjectAges.push(parseInt(ageField.value as string, 10));
          }
        }
      });

      console.log(
        "Total Man Hours Model query results:",
        Array.from(matchedSubjectCategories),
        Array.from(matchedSubjectActivities),
        Array.from(matchedWeatherConditions),
        subjectAges,
      );

      return {
        matchedSubjectCategories: Array.from(matchedSubjectCategories),
        matchedSubjectActivities: Array.from(matchedSubjectActivities),
        matchedWeatherConditions: Array.from(matchedWeatherConditions),
        subjectAges,
      };
    },
  });
};

// Returns a query object for all needed inputs for the Resource Allocation and Geospatial prediction models
// queries for the following inputs: incident start time, number of rangers, activity, subject age, and subject gender
// export const useReAlGeModelInput = (incidentId) => {
//   // ... to be implemented
// };
