/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import "./index.css"
import { Footer, ForecastCard, Header, MainInfo } from "./components/export"

export const MainPage = () => {
    const [coords, setCoords] = useState({lat: 51.509865, lon: -0.118092})

    const [json0, setJson0] = useState()
    const [cityName, setCityName] = useState()
    const [searchValue, setSearchValue] = useState()
    const [weatherData, setWeatherData] = useState()

    const [selectValue, setSelectValue] = useState()

    //Стандартна локація (Лондон) (В планах зробити запит про локацію користувача при заході на сайт)

    const getDefWeatherData = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=uk&appid=7ac3df89aa900441a1d739cbd173fb5e`);
        const json = await response.json()
        setWeatherData(json)
        setCityName("Лондон")
    }

    useEffect(() => {
        getDefWeatherData();
        getForecast()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 
    //

    const getCoords = async () => {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=1&appid=7ac3df89aa900441a1d739cbd173fb5e`)
        const json = await response.json()
        if (json.length > 0) {
            setCoords({lat: json[0].lat, lon: json[0].lon})
            setJson0(json[0])
        } else {
            alert("Місто не знайдено :(")
        }
    }
    
    const getWeatherData = async () => {
        const responseWthr = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=ua&appid=7ac3df89aa900441a1d739cbd173fb5e`)
        const json = await responseWthr.json()
        setWeatherData(json)

        //Назва міста
        if (json0.local_names.uk) {
            setCityName(json0.local_names.uk)
        } else {
            setCityName(searchValue)
        }
    }

    useEffect(() => {
        if (json0) {
            getWeatherData()
            getForecast()
        } else {
            console.log("No json0")
        }
        console.log(weatherData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coords])

// 

    const [forecastSt0, setForecastSt0] = useState()
    const [forecastSt1, setForecastSt1] = useState()
    const [forecastSt2, setForecastSt2] = useState()
    const [forecastSt3, setForecastSt3] = useState()

    const nextDay = (prevDay, step) => {
        const nextDay = new Date((Math.floor(prevDay.getTime()/86400000)*86400000) + step*86400000)
        return(nextDay)
    }

    const getForecast = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=uk&appid=7ac3df89aa900441a1d739cbd173fb5e`)
        const json = await response.json()

        const filter = (step) => {
            const today = new Date()
            const floorDate = nextDay(today, step)
            const ceilingDate = nextDay(floorDate, 1)
            let forecast = json.list
            forecast = forecast.filter(el => el.dt >= floorDate/1000)
            forecast = forecast.filter(el => el.dt < ceilingDate/1000)

            return(forecast)
        }

        const dayAhead = () => {
            const today = new Date()
            const floorDate = today
            const ceilingDate = today.getTime() + 86400000
            let forecast = json.list
            forecast = forecast.filter(el => el.dt >= floorDate/1000)
            forecast = forecast.filter(el => el.dt <= ceilingDate/1000)
            return(forecast)
        }
        
        setForecastSt0(dayAhead())
        setForecastSt1(filter(1))
        setForecastSt2(filter(2))
        setForecastSt3(filter(3))
    }

    // !!!Цей набір функцій - тимчасова заглушка, пізніше я спробую знайти більш оптимізований спосіб розраховувати середнє значення


    const avgTemp = (array, temp) => {
        const arr = (array)
        const sum = arr.reduce((a, b) => a + b.main.temp, 0);
        const avg = (sum / arr.length) || 0;
        return(Math.round(avg*10)/10)
    }
    
    const avgHum = (array) => {
        const arr = (array)
        const sum = arr.reduce((a, b) => a + b.main.humidity, 0);
        const avg = (sum / arr.length) || 0;
        return(Math.round(avg))
    }

    const avgFeelLike = (array) => {
        const arr = (array)
        const sum = arr.reduce((a, b) => a + b.main.feels_like, 0);
        const avg = (sum / arr.length) || 0;
        return(Math.round(avg*10)/10)
    }

    const avgVisibility = (array) => {
        const arr = (array)
        const sum = arr.reduce((a, b) => a + b.visibility, 0);
        const avg = (sum / arr.length) || 0;
        return(Math.round(avg/100)/10)
    }

    //

    const avgObject = (array) => {
        return({temp: avgTemp(array), humidity: avgHum(array), feelsLike: avgFeelLike(array), visibility: avgVisibility(array)})
    } 

    const onChangeTimePicker = (value, forecast) => {
        if (value === "current") {
            if (searchValue) {
                getCoords()
            } else {
                getDefWeatherData()
            }
        } else {
            setWeatherData(forecast[value])
        }
        setSelectValue(value)
        // setWeatherData(el)
    }
    // console.log(forecastSt0[0])

// ------------------------------------------

    if (weatherData === undefined) {
        return <>Loading</>;
    } 

    if (forecastSt0 === undefined) {
        return <>Loading</>;
    }

    return (
        <>
        <section className="topSection">
            <Header setSearchValue={setSearchValue} onSubmit={getCoords} />
            <div className="mainInfo">
                <MainInfo weatherData={weatherData} city={cityName} forecast={forecastSt0} selectValue={selectValue} onChange={onChangeTimePicker}/>
            </div>
        </section>
        <section className="bottomSection">
            <h1>Прогнози погоди</h1>
            <div>
                <ForecastCard forecast={forecastSt1} avg={avgObject(forecastSt1)}/>
                <ForecastCard forecast={forecastSt2} avg={avgObject(forecastSt2)}/>
                <ForecastCard forecast={forecastSt3} avg={avgObject(forecastSt3)}/>
            </div>
            <Footer/>
        </section>
        </>
    )
}
