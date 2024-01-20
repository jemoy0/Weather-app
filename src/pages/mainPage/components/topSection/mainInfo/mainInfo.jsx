// import { HourlyForecast } from "./hourlyForecast/hourlyForecast"
import "./mainInfo.css"
import { InfoRow } from "./infoRow/infoRow"
import { TimePicker } from "./timePicker/timePicker"

export const MainInfo = ({weatherData, city, forecast, selectValue, onChange}) => {
    const date = new Date(weatherData.dt*1000)
     
    return(
        <div className="mainSection">
            <div className="container">
                <div className="additionalInfo">
                    <div>
                        <div className="city">{city}</div>
                        <div className="date">
                            <div>{date.toLocaleDateString()}</div>
                            <TimePicker forecast={forecast} value1={selectValue} onChange={onChange} />
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
                        <InfoRow label={"Тиск:"} value={Math.round(weatherData.main.pressure/10) + 'кПа'} />
                        <InfoRow label={"Видимість:"} value={Math.round(weatherData.visibility/100)/10 + "км"} />
                        <InfoRow label={"Вітер:"} value={weatherData.wind.speed + "м/с"} />
                    </div>
                </div>
            </div>
        </div>
    )
}