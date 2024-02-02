/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./mainPage.css";
import { Footer, Forecasts, Header, MainInfo } from "../../components/export";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Chartt } from "../../components/chart/chart";

import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const MainPage = () => {
  const location = useLocation();
  const [coords, setCoords] = useState({ lat: 51.509865, lon: -0.118092 });

  const [weatherData, setWeatherData] = useState();
  const [respJson, setRespJson] = useState();
  const [cityName, setCityName] = useState();

  const [searchValue, setSearchValue] = useState();
  const [selectTimeValue, setSelectTimeValue] = useState();
  const [selectCategoryValue, setSelectCategoryValue] = useState();

  const [data, setData] = useState();
  const navigate = useNavigate();

  // ------------------------------------------

  const getDefaultWeatherData = async () => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=uk&appid=7ac3df89aa900441a1d739cbd173fb5e`);
    const json = await response.json();
    setWeatherData(json);
    setCityName("Лондон");
  };

  useEffect(() => {
    if (location.state) {
      getCoords(location.state);
    } else {
      getDefaultWeatherData();
    }

    getForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------
  // Основні функції

  const getCoords = async (city) => {
    const response = await fetch(!city ? `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=1&appid=7ac3df89aa900441a1d739cbd173fb5e` : `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=7ac3df89aa900441a1d739cbd173fb5e`);
    const json = await response.json();
    if (json.length > 0) {
      setCoords({ lat: json[0].lat, lon: json[0].lon });
      setRespJson(json[0]);
    } else {
      alert("Місто не знайдено :(");
      if (location.state) {
        location.state = undefined;
        getDefaultWeatherData();
      }
    }
  };

  const getWeatherData = async () => {
    const responseWthr = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=ua&appid=7ac3df89aa900441a1d739cbd173fb5e`);
    const json = await responseWthr.json();
    setWeatherData(json);

    if (respJson.local_names.uk) {
      setCityName(respJson.local_names.uk);
    } else {
      setCityName(searchValue);
    }

    console.log(json);
  };

  useEffect(() => {
    if (respJson) {
      getWeatherData();
      getForecast();
    } else {
      console.log("No respJson");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  // ------------------------------------------
  // Прогнози погоди

  const [forecastSt0, setForecastSt0] = useState();
  const [forecastSt1, setForecastSt1] = useState();
  const [forecastSt2, setForecastSt2] = useState();
  const [forecastSt3, setForecastSt3] = useState();

  const nextDay = (prevDay, step) => {
    const nextDay = new Date(Math.floor(prevDay.getTime() / 86400000) * 86400000 + step * 86400000);
    return nextDay;
  };

  const getForecast = async () => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=uk&appid=7ac3df89aa900441a1d739cbd173fb5e`);
    const json = await response.json();

    const filter = (step) => {
      const today = new Date();
      const floorDate = nextDay(today, step);
      const ceilingDate = nextDay(floorDate, 1);
      let forecast = json.list;
      forecast = forecast.filter((el) => el.dt >= floorDate.getTime() / 1000);
      forecast = forecast.filter((el) => el.dt < ceilingDate.getTime() / 1000);

      return forecast;
    };

    const dayAhead = () => {
      const today = new Date();
      const floorDate = today;
      const ceilingDate = today.getTime() + 86400000;
      let forecast = json.list;
      forecast = forecast.filter((el) => el.dt >= floorDate.getTime() / 1000);
      forecast = forecast.filter((el) => el.dt <= ceilingDate / 1000);

      return forecast;
    };

    setForecastSt0(dayAhead());
    setForecastSt1(filter(1));
    setForecastSt2(filter(2));
    setForecastSt3(filter(3));
  };

  const avgValue = (array, values, coef, action) => {
    const arr = array;
    const sum = arr.reduce((a, b) => (b["main"][values] ? a + b["main"][values] : a + b[values]), 0);
    const avg = sum / arr.length || 0;
    return action === "mp" ? Math.round(avg * coef) / coef : Math.round(avg / 100) / 10;
  };

  const avgObject = (array) => {
    return { temp: avgValue(array, "temp", 10, "mp"), humidity: avgValue(array, "humidity", 1, "mp"), feelsLike: avgValue(array, "feels_like", 10, "mp"), visibility: avgValue(array, "visibility") };
  };

  useEffect(() => {
    if (forecastSt0) {
      setData({
        labels: forecastSt0.map((el) => new Date(el.dt * 1000).getHours() + ":00"),
        datasets: [
          {
            label: "Температура °C",
            data: forecastSt0.map((el) => Math.round(el.main.temp * 10) / 10),
            backgroundColor: "#fff",
            borderColor: "#70767a",
            pointBorderWidth: 3,
            pointHoverBorderWidth: 3,
            pointHoverRadius: 10,
            pointRadius: 5,
            tension: 0.1,
          },
        ],
      });
    } else {
      console.log(1);
    }
  }, [forecastSt0]);

  // ------------------------------------------
  // Інше

  const onChangeTimePicker = (value, forecast) => {
    if (value === "current") {
      if (!searchValue) {
        if (location.state) {
          console.log(weatherData);
          getCoords(location.state);
        } else {
          getDefaultWeatherData();
        }
      } else {
        getCoords(searchValue);
      }
    } else {
      setWeatherData(forecast[value]);
    }
    setSelectCategoryValue("Температура");
    setSelectTimeValue(value);

    // setWeatherData(el);
  };

  const onChangeCategoryPicker = (value, label) => {
    setData({
      labels: forecastSt0.map((el) => new Date(el.dt * 1000).getHours() + ":00"),
      datasets: [
        {
          label: label,
          data: forecastSt0.map((el) => {
            if (value === "pressure") {
              return Math.round(el.main[value]) / 10;
            } else if (value === "speed") {
              return Math.round(el.wind[value] * 10) / 10;
            } else {
              return Math.round(el.main[value] * 10) / 10;
            }
          }),
          backgroundColor: "#fff",
          borderColor: "#70767a",
          pointBorderWidth: 3,
          pointHoverBorderWidth: 3,
          pointHoverRadius: 10,
          pointRadius: 5,
          tension: 0.1,
        },
      ],
    });
    setSelectCategoryValue(value);
  };

  // ------------------------------------------

  if (weatherData === undefined) {
    return <>Loading</>;
  }

  if (forecastSt0 === undefined) {
    return <>Loading</>;
  }

  if (data === undefined) {
    return <>Loading</>;
  }

  return (
    <>
      <Header onSubmit={getCoords} setSearchValue={setSearchValue} state={{ homeButton: false, forecasts: true }} />
      <section className="topSection">
        <div className="mainInfo">
          <MainInfo weatherData={weatherData} city={cityName} forecast={forecastSt0} selectTimeValue={selectTimeValue} onChange={[onChangeTimePicker, setSelectTimeValue]} state={{ current: true }} />
        </div>
      </section>
      <section className="chart" id="chart">
        <Chartt data={data} onChange={onChangeCategoryPicker} value={selectCategoryValue} />
      </section>
      <section className="bottomSection" id="forecasts">
        <Forecasts forecasts={[forecastSt1, forecastSt2, forecastSt3]} averageValues={[avgObject(forecastSt1), avgObject(forecastSt2), avgObject(forecastSt3)]} cityname={cityName} />
        <Footer />
      </section>
    </>
  );
};
