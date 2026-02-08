"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../Firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import { FormSection, FormField } from "../../forms/Form";

interface MissingPerson {
  id: string;
  name: string;
  age: string;
  sex: string;
  height: string;
  weight: string;
  clothingDesc: string;
  photoURL?: string;
}

const extractField = (sections: FormSection[], fieldName: string): string => {
  for (let section of sections) {
    const field = section.fields.find((f) => f.name === fieldName);
    if (field && typeof field.value === "string") {
      return field.value;
    }
  }
  return "Not specified";
};

const fetchFormDetails = async (
  incidentId: string,
  formId: string,
): Promise<MissingPerson[]> => {
  console.log("hi fetching form details incidentId:", incidentId);
  const q = query(
    collection(db, "incidents", incidentId, "forms"),
    where("key", "==", formId),
  );

  const forms: MissingPerson[] = [];
  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        const data = doc.data();
        console.log(data.sections);
        forms.push({
          id: doc.id,
          name: extractField(data.sections, "subjectName"),
          age: extractField(data.sections, "subjectAge"),
          sex: extractField(data.sections, "subjectSex"),
          height: extractField(data.sections, "height"),
          weight: extractField(data.sections, "weight"),
          clothingDesc: extractField(data.sections, "clothingDescription"),
          photoURL: data["photoURL"],
        });
      });
    } else {
      console.log("form sar100a doesn't exist");
      forms.push({
        id: "not-specified",
        name: "not specified",
        age: "not specified",
        sex: "not specified",
        height: "not specified",
        weight: "not specified",
        clothingDesc: "not specified",
      });
    }

    return forms;
  } catch (error) {
    console.error("error fetching form data: ", error);
    return [];
  }
};

const MissingPersonsPane = ({ incident }: { incident: any }) => {
  const [formData, setFormData] = useState<MissingPerson[]>([]); // Add typing
  const params = useParams();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);

  useEffect(() => {
    fetchFormDetails(params.incidentId as string, "sar100a")
      .then((data) => setFormData(data))
      .catch((err) => console.error("this error here", err));
  }, []);

  const dataItems = formData.map(() => {
    return {};
  });

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === dataItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? dataItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex: number) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides1 = formData.map((item, index) => {
    return (
      <CarouselItem
        key={index}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
          }}
        >
          <img
            src={
              item.photoURL
                ? item.photoURL
                : "/images/person_icon.png"
            }
            onError={(e) => {
              console.log("loading image error. Image not found");
              (e.target as HTMLImageElement).src = "/images/person_icon.png";
            }}
            style={{
              margin: "auto",
              display: "block",
              marginTop: "15px",
              marginBottom: "15px",
              maxHeight: "250px",
            }}
          />
          <>
            <div
              style={{
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <b>Name: </b> {item.name}
            </div>
            <div
              style={{
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <b>Age: </b> {item.age}
            </div>
            <div
              style={{
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <b>Sex: </b> {item.sex}
            </div>
            <div
              style={{
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <b>Height: </b> {item.height}
            </div>
            <div
              style={{
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <b>Weight: </b> {item.weight}
            </div>
            <div
              style={{
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <b>Clothing Description: </b> {item.clothingDesc}
            </div>
          </>
        </div>
      </CarouselItem>
    );
  });

  if (!incident) {
    return <div>no missing person available</div>;
  }

  return (
    <div>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        interval={null}
        style={{
          minHeight: "95%",
          maxHeight: "95%",
        }}
      >
        {formData && formData.length > 1 ? (
          <CarouselIndicators
            items={dataItems}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
            cssModule={{ backgroundColor: "black" }}
          />
        ) : null}
        {slides1}
        {formData && formData.length > 1 ? (
          <>
            <CarouselControl
              direction="prev"
              directionText="Previous"
              onClickHandler={previous}
            />
            <CarouselControl
              direction="next"
              directionText="Next"
              onClickHandler={next}
            />
          </>
        ) : null}
      </Carousel>
    </div>
  );
};

export default MissingPersonsPane;
