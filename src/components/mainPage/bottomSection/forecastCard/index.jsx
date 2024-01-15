
import "./index.css"
import { SmInfoRow } from "./smInfoRow"

export const ForecastCard = ({ avg, forecast }) => {

    const midday = forecast[4]
    const date = new Date(midday.dt*1000).toLocaleDateString()

    return(
        <div className="card">
            <div className="date">{date}</div>
            <div className="icon">
                <img alt="icon" src={`https://openweathermap.org/img/wn/${midday.weather[0].icon}@2x.png`}/>
                <div>{midday.weather[0].description}</div>
            </div>
            <div className="temperature">{avg.temp}°C</div>
            <div>
                <SmInfoRow label={"Відчувається як:"} value={avg.feelsLike + "°C"}/>
                <SmInfoRow label={"Вологість:"} value={avg.humidity + "%"}/>
                <SmInfoRow label={"Видимість:"} value={avg.visibility + "км"}/>
            </div>
        </div>
    )
}