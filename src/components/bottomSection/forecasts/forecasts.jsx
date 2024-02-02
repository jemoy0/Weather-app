import { ForecastCard } from "./forecastCard/forecastCard";
import "./index.css";

export const Forecasts = ({ forecasts, averageValues, setForecast, cityname, step }) => {
  return (
    <div className="forecastList">
      <ForecastCard forecast={forecasts[0]} avg={averageValues[0]} cityname={cityname} step={1} />
      <ForecastCard forecast={forecasts[1]} avg={averageValues[1]} cityname={cityname} step={2} />
      <ForecastCard forecast={forecasts[2]} avg={averageValues[2]} cityname={cityname} step={3} />
    </div>
  );
};
