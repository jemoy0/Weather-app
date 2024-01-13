import "./index.css"
import { InfoRow } from "./infoRow"

export const MainInfo = ({weatherData, city}) => {
    const date = new Date(weatherData.dt*1000)
     
    return(
        <div className="container">
            <div className="additionalInfo">
                <div>
                    <div className="city">{city}</div>
                    <div className="date">
                        <div>{date.getDate() + "." + (date.getMonth > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + "." + date.getFullYear()}</div>
                        <div className="time">{date.getHours() + ":" + date.getMinutes()}</div>
                    </div>
                </div>
                <div className="icon">
                    <img alt="icon" src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}/>
                    <div>{weatherData.weather[0].description}</div>
                </div>
            </div>
            <div className="weatherData">
                <div className="temperature">{Math.round(weatherData.main.temp*10)/10}°C</div>
                <div className="infoList">
                    <InfoRow label={"Відчувається як:"} value={Math.round(weatherData.main.feels_like*10)/10 + "°C"}/>
                    <InfoRow label={"Вологість:"} value={weatherData.main.humidity + "%"} />
                    <InfoRow label={"Тиск:"} value={weatherData.main.pressure + 'гПа'} />
                    <InfoRow label={"Видимість:"} value={Math.round(weatherData.visibility/100)/10 + "км"} />
                </div>
            </div>
        </div>
    )
}