import { useEffect, useState } from "react";
import { Footer, Header, MainInfo } from "../../components/export";
import { useNavigate, useParams } from "react-router-dom";
import { Chartt } from "../../components/chart/chart";
import "./forecastPage.css";

require("react-dom");
window.React2 = require("react");
console.log(window.React1 === window.React2);

export const ForecastsPage = () => {
  const params = useParams();

  const [forecast, setForecast] = useState();
  const [coords, setCoords] = useState({ lat: 51.509865, lon: -0.118092 });

  const [weatherData, setWeatherData] = useState();
  const [respJson, setRespJson] = useState();
  const [cityName, setCityName] = useState();

  const [selectCategoryValue, setSelectCategoryValue] = useState();
  const [selectTimeValue, setSelectTimeValue] = useState();
  const [searchValue, setSearchValue] = useState();
  const [data, setData] = useState();

  const navigate = useNavigate();

  // ------------------------------------------

  useEffect(() => {
    getCoords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------
  // Основні функції

  const getCoords = async () => {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${params.city}&limit=1&appid=7ac3df89aa900441a1d739cbd173fb5e`);
    const json = await response.json();
    if (json.length > 0) {
      setCoords({ lat: json[0].lat, lon: json[0].lon });
      setRespJson(json[0]);
    } else {
      alert("Місто не знайдено :(");
    }
  };

  const getWeatherData = async () => {
    const responseWthr = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=ua&appid=7ac3df89aa900441a1d739cbd173fb5e`);
    const json = await responseWthr.json();
    setWeatherData(json);

    //Назва міста
    if (respJson.local_names.uk) {
      setCityName(respJson.local_names.uk);
    } else {
      setCityName(searchValue);
    }
  };

  useEffect(() => {
    if (respJson) {
      getWeatherData();
      getForecast();
    }

    if (forecast) {
      setWeatherData(forecast[0]);
      setSelectTimeValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  // ------------------------------------------
  // Прогноз погоди

  const getForecast = async () => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=uk&appid=7ac3df89aa900441a1d739cbd173fb5e`);
    const json = await response.json();

    const nextDay = (prevDay, step) => {
      const nextDay = new Date(Math.floor(prevDay.getTime() / 86400000) * 86400000 + step * 86400000);
      return nextDay;
    };

    const filter = (step) => {
      const today = new Date();
      const floorDate = nextDay(today, step);
      const ceilingDate = nextDay(floorDate, 1);
      let forecast = json.list;
      forecast = forecast.filter((el) => el.dt >= floorDate / 1000);
      forecast = forecast.filter((el) => el.dt < ceilingDate / 1000);

      return forecast;
    };
    setForecast(filter(params.step));
  };

  // Інформація для графіка:

  useEffect(() => {
    if (forecast) {
      console.log(forecast);
      setData({
        labels: forecast.map((el) => new Date(el.dt * 1000).getHours() + ":00"),
        datasets: [
          {
            label: "Температура °C",
            data: forecast.map((el) => Math.round(el.main.temp * 10) / 10),
            backgroundColor: "#fff",
            borderColor: "#70767a",
            borderDash: (20)[10],
            pointBorderWidth: 3,
            pointHoverBorderWidth: 3,
            pointHoverRadius: 10,
            pointRadius: 6.25,
          },
        ],
      });
    } else {
      console.log(1);
    }
  }, [forecast]);

  // ------------------------------------------
  // Інше

  const onChangeTimePicker = (value, forecast) => {
    setWeatherData(forecast[value]);
    setSelectTimeValue(value);
    // setWeatherData(el);
  };

  const onHeaderSubmit = () => {
    navigate("/", { state: searchValue });
  };

  // Інформація для графіка:

  const onChangeCategoryPicker = (value, label) => {
    setData({
      labels: forecast.map((el) => new Date(el.dt * 1000).getHours() + ":00"),
      datasets: [
        {
          label: label,
          data: forecast.map((el) => {
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

  if (forecast === undefined) {
    console.log(forecast, 1);
    return <>Loading</>;
  }

  if (weatherData === undefined) {
    console.log(weatherData, 2);
    return <>Loading</>;
  }

  if (data === undefined) {
    console.log(data, 3);
    return <>Loading...</>;
  }

  return (
    <>
      <Header onSubmit={onHeaderSubmit} setSearchValue={setSearchValue} state={{ homeButton: true, forecasts: false }} />
      <section className="topSection">
        <div className="mainInfo">
          <MainInfo weatherData={weatherData} city={cityName} forecast={forecast} selectTimeValue={selectTimeValue} onChange={[onChangeTimePicker, setWeatherData]} state={{ current: false }} />
        </div>
      </section>
      <section className="chart" id="chart">
        <Chartt data={data} onChange={onChangeCategoryPicker} value={selectCategoryValue} />
      </section>
      <Footer />
    </>
  );
};
