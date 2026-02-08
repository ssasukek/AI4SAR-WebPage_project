"use client";

import { GoogleMap } from "@react-google-maps/api";

// styling
export const defaultMapContainerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: "15px 0px 0px 15px",
};

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "satellite",
};

const defaultMapZoom = 18;

const MapComponent = (props) => {
  const defaultMapCenter = {
    lat: Number(props.commandPostLatitude),
    lng: Number(props.commandPostLongitude),
  };
  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      ></GoogleMap>
    </div>
  );
};

export { MapComponent };
