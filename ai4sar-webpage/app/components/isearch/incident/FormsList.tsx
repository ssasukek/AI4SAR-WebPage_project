import React from "react";
import { useRouter } from "next/navigation";
//import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Card, CardBody } from "reactstrap";
import { BsPlusLg } from "react-icons/bs";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
  },
};

const FormCard = ({ name, route }) => {
  let navigate = useRouter();
  // onClick={() => navigate(`/${operation.incidentNumber}`)}>
  const handleClick = () => {
    navigate.push(`/incidents${route}`);
  };
  return (
    <div
      style={{ cursor: "pointer", margin: "calc(1vw + .75rem)" }}
      onClick={() => handleClick()}
    >
      <Card className="card-styles" style={{ height: "200px" }}>
        <CardBody
          style={{
            padding: "calc(1vw + .75rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h5>{name}</h5>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BsPlusLg />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const FormsList = ({ params }) => {
  return <div></div>;
  // return (
  //   <Carousel
  //     responsive={responsive}
  //     removeArrowOnDeviceType={["tablet", "mobile"]}
  //   >
  //     {getFormsList().map(({ key, title }) => (
  //       <FormCard name={title} route={`/${params.incidentId}/${key}`} />
  //     ))}
  //   </Carousel>
  // );
};

export default FormsList;
