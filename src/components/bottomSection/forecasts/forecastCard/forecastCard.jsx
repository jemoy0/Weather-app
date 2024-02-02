import { Link } from "react-router-dom";
import "./forecastCard.css";
import { SmInfoRow } from "./smInfoRow";

export const ForecastCard = ({ avg, forecast, cityname, step }) => {
  const midday = forecast[4];
  const date = new Date(midday.dt * 1000);

  const dayList = {
    0: "Нд",
    1: "Пн",
    2: "Вт",
    3: "Ср",
    4: "Чт",
    5: "Пт",
    6: "Сб",
  };

  return (
    <Link to={`/${cityname}/${step}`} className="card">
      <div className="date">{dayList[date.getDay()] + " " + date.toLocaleDateString()}</div>
      <div className="icon">
        <img alt="icon" src={`https://openweathermap.org/img/wn/${midday.weather[0].icon}@2x.png`} />
        <div>{midday.weather[0].description}</div>
      </div>
      <div className="temperature">{avg.temp}°C</div>
      <div className="info">
        <SmInfoRow label={"Відчувається як:"} value={avg.feelsLike + "°C"} />
        <SmInfoRow label={"Вологість:"} value={avg.humidity + "%"} />
        <SmInfoRow label={"Видимість:"} value={avg.visibility + "км"} />
      </div>
    </Link>
  );
};
