import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Container,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "reactstrap";
import { Card } from "reactstrap";
//import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
//import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
//import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

Chart.register(CategoryScale);

const WeatherBox = () => {
  // user input
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [days, setDays] = useState(1);

  const [dataType, setDataType] = useState("temperature");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // chart initial options (temperature initially)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192)",
        lineWidth: 1,
        pointBorderWidth: 4,
        pointHoverRadius: 8,
      },
    ],
  });

  // chart setup
  const [chartTitle, setChartTitle] = useState("Temperature Chart");
  const [chartSubtitle, setChartSubTitle] = useState("Hourly Temperature");
  const [yAxisTitle, setYAxisTitle] = useState("Temperature (°C)");

  // fetched API data
  const [tempData, setTempData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [precipitationData, setPrecipitationData] = useState([]);
  const [cloudCoverData, setCloudCoverData] = useState([]);
  const [windSpeedData, setWindSpeedData] = useState([]);
  const [windDirectionData, setWindDirectionData] = useState([]);

  // used for indexing in weather cards
  const [startIndex, setStartIndex] = useState(0);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLat(latitude);
    setLong(longitude);
  };

  const error = () => {
    console.log("Unable to retrieve your location");
  };

  const updateLabel = (newLabel) => {
    setChartData((prevChartData) => ({
      ...prevChartData,
      datasets: prevChartData.datasets.map((dataset) => ({
        ...dataset,
        label: newLabel,
        pointRadius: 5,
      })),
    }));
    setYAxisTitle(newLabel);
  };

  // update chart options based on weather data type
  const updateChartData = (type) => {
    if (type === "temperature") {
      updateLabel("Temperature (°C)");
      setChartSubTitle("Hourly Temperature");
      setChartTitle("Temperature Chart");

      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: tempData,
          },
        ],
      }));
    }

    if (type === "humidity") {
      updateLabel("Relative Humidity (%)");
      setChartSubTitle("Hourly Relative Humidity");
      setChartTitle("Relative Humidity Chart");

      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: humidityData,
          },
        ],
      }));
    }

    if (type === "precipitation") {
      updateLabel("Precipitation Probability %");
      setChartSubTitle("Hourly Precipitation Probability");
      setChartTitle("Precipitation Chart");

      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: precipitationData,
          },
        ],
      }));
    }

    if (type === "cloudCover") {
      updateLabel("Cloud Cover (%)");
      setChartSubTitle("Hourly Cloud Cover");
      setChartTitle("Cloud Cover Chart");

      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: cloudCoverData,
          },
        ],
      }));
    }

    if (type === "windSpeed") {
      updateLabel("Wind Speed (km/h)");
      setChartSubTitle("Hourly Wind Speed");
      setChartTitle("Wind Speed Chart");

      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: windSpeedData,
          },
        ],
      }));
    }

    if (type === "windDirection") {
      updateLabel("Wind Direction (degrees)");
      setChartSubTitle("Hourly Wind Direction");
      setChartTitle("Wind Direction Chart");

      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: windDirectionData,
          },
        ],
      }));
    }

    setDataType(type);
  };

  // fetch weather data from open meteo API
  const fetchWeatherData = async () => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&past_days=${days}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,cloud_cover,wind_speed_10m,wind_direction_10m`;
    const response = await fetch(url);
    const res = await response.json();

    // Slice 24 data points per day (hourly)
    const tempDataSlice = res.hourly.temperature_2m.slice(0, days * 24);
    const humidityDataSlice = res.hourly.relative_humidity_2m.slice(0, days * 24);
    const precipitationDataSlice = res.hourly.precipitation_probability.slice(
      0,
      days * 24,
    );

    const cloudCoverSlice = res.hourly.cloud_cover.slice(0, days * 24);
    const windSpeedDataSlice = res.hourly.wind_speed_10m.slice(0, days * 24);
    const windDirectionDataSlice = res.hourly.wind_direction_10m.slice(0, days * 24);

    setTempData(tempDataSlice);
    setHumidityData(humidityDataSlice);
    setPrecipitationData(precipitationDataSlice);

    setCloudCoverData(cloudCoverSlice);
    setWindSpeedData(windSpeedDataSlice);
    setWindDirectionData(windDirectionDataSlice);

    // load initial data to chart (temp is default)

    if (dataType === "temperature") {
      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: tempDataSlice,
          },
        ],
      }));
    }

    if (dataType === "humidity") {
      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: humidityDataSlice,
          },
        ],
      }));
    }

    if (dataType === "precipitation") {
      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: precipitationDataSlice,
          },
        ],
      }));
    }

    if (dataType === "cloudCover") {
      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: cloudCoverSlice,
          },
        ],
      }));
    }

    if (dataType === "windSpeed") {
      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: windSpeedDataSlice,
          },
        ],
      }));
    }

    if (dataType === "windDirection") {
      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: windDirectionDataSlice,
          },
        ],
      }));
    }
  };

  // create hourly labels for chart data
  const setHourLabels = () => {
    // set time labels on graph
    // ex. 10:00 AM Mon
    const now = new Date();
    const currentHour = now.getHours();
    const currentDayIndex = now.getDay();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Generate labels for the chart data starting from startIndex
    const labels = Array.from({ length: days * 24 }, (_, i) => {
      const hour = (currentHour + startIndex + i) % 24;
      const dayIndex =
        currentHour + startIndex + i < 24
          ? currentDayIndex
          : (currentDayIndex + Math.floor((currentHour + startIndex + i) / 24)) % 7;
      const dayLabel = daysOfWeek[dayIndex];
      return `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour < 12 ? "AM" : "PM"} ${dayLabel}`;
    });

    // save to chart
    setChartData((prevChartData) => ({
      ...prevChartData,
      labels: labels,
    }));
  };

  useEffect(() => {
    if (lat && long) {
      setHourLabels();
      fetchWeatherData();
    }
  }, [lat, long, days]);

  useEffect(() => {
    handleLocationClick();
  }, []);

  // for weather cards
  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 3, tempData.length - 3));
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 3, 0));
  };

  return (
    <Container>
      <div className="chart-container" style={{ position: "relative" }}>
        <div style={{ marginTop: 5 }}>
          {" "}
          <b>Weather</b>
        </div>

        <Card style={{ marginTop: 15 }}>
          {lat && long ? (
            <Line
              data={chartData}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: chartSubtitle,
                    font: {
                      size: 16,
                    },
                  },
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    displayColors: false,
                  },
                },
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: yAxisTitle,
                    },
                  },
                },
              }}
            />
          ) : (
            <div style={{ width: "100%" }}>
              <Spinner
                size="lg"
                color="primary"
                style={{
                  margin: "40px",
                  fontSize: "12px",
                }}
              />
            </div>
          )}
        </Card>
        <Dropdown
          isOpen={dropdownOpen}
          toggle={toggle}
          direction={"down"}
          style={{ position: "absolute", left: 0, padding: "20px 5px" }}
        >
          <DropdownToggle caret>{days}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Days</DropdownItem>
            <DropdownItem onClick={() => setDays(1)}>1</DropdownItem>
            <DropdownItem onClick={() => setDays(2)}>2</DropdownItem>
            <DropdownItem onClick={() => setDays(3)}>3</DropdownItem>
            <DropdownItem onClick={() => setDays(4)}>4</DropdownItem>
            <DropdownItem onClick={() => setDays(5)}>5</DropdownItem>
            <DropdownItem onClick={() => setDays(6)}>6</DropdownItem>
            <DropdownItem onClick={() => setDays(7)}>7</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          whiteSpace: "nowrap",
        }}
      >
        <Button
          onClick={() => updateChartData("temperature")}
          style={{ marginRight: 5, fontSize: "10pt", padding: "4px 5px" }}
        >
          Temperature
        </Button>
        <Button
          onClick={() => updateChartData("precipitation")}
          style={{ marginRight: 5, fontSize: "10pt", padding: "4px 5px" }}
        >
          Precipitation
        </Button>
        <Button
          onClick={() => updateChartData("humidity")}
          style={{ fontSize: "10pt", padding: "4px 5px" }}
        >
          Humidity
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          whiteSpace: "nowrap",
          marginTop: "5px",
        }}
      >
        <Button
          onClick={() => updateChartData("cloudCover")}
          style={{ marginRight: 5, fontSize: "10pt", padding: "4px 5px" }}
        >
          Cloud Cover
        </Button>
        <Button
          onClick={() => updateChartData("windSpeed")}
          style={{ marginRight: 5, fontSize: "10pt", padding: "4px 5px" }}
        >
          Wind Speed
        </Button>
        <Button
          onClick={() => updateChartData("windDirection")}
          style={{ fontSize: "10pt", padding: "4px 5px" }}
        >
          Wind Direction
        </Button>
      </div>

      {/*
      <div style={{ whiteSpace: 'nowrap', display: 'flex', overflowX: 'hidden' }}>
        {tempData.slice(startIndex, startIndex + 3).map((temperature, index) => (
          <Col key={index} className="mb-4">
            <Card style={{ height: '100%', marginLeft: '5px', marginRight: '5px' }}>
              <CardBody style={{ whiteSpace: 'nowrap' }}>
                <CardTitle tag="h6">{chartData.labels[startIndex + index]}</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">{`${temperature}°C`}</CardSubtitle>
                <CardSubtitle tag="h5" className="mb-2 text-muted">
                  <WbSunnyOutlinedIcon />
                </CardSubtitle>
              </CardBody>
            </Card>
          </Col>
        ))}
      </div>
      <div>
        <Button onClick={handlePrev} disabled={startIndex === 0} style={{ margin: '10px' }}>
          <KeyboardArrowLeftOutlinedIcon />
        </Button>
        <Button onClick={handleNext} disabled={startIndex >= tempData.length - 3} style={{ margin: '10px' }}>
          <KeyboardArrowRightOutlinedIcon />
        </Button>
      </div>
      */}
    </Container>
  );
};

export default WeatherBox;
