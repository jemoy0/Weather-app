import { useEffect, useState } from "react"
import { Header, MainInfo } from "./topSection"
import "./index.css"
import { ForecastCard } from "./bottomSection/forecastCard"

export const MainPage = () => {
    const [coords, setCoords] = useState({lat: 51.509865, lon: -0.118092})

// Верхня секція
    const [json0, setJson0] = useState()
    const [cityName, setCityName] = useState()
    const [searchValue, setSearchValue] = useState()
    const [weatherData, setWeatherData] = useState()

    //Стандартна локація (Лондон) (В планах зробити запит про локацію користувача при заході на сайт)
    useEffect(() => {
        const getDefWeatherData = async () => {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=uk&appid=7ac3df89aa900441a1d739cbd173fb5e`);
            const json = await response.json()
            setWeatherData(json)
            setCityName("Лондон")
        }
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
        // isInitialMount.current = false
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

// Нижня секція

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
        
        setForecastSt1(Object.values(filter(1)))
        setForecastSt2(Object.values(filter(2)))
        setForecastSt3(Object.values(filter(3)))
        
    }

    // !!!Цей набір функцій - тимчасова заглушка, пізніше я спробую знайти більш оптимізований спосіб розраховувати середнє значення

    const avgTemp = (array) => {
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
        return(Math.round(avg)/1000)
    }

    //

    const avgObject = (array) => {
        return({temp: avgTemp(array), humidity: avgHum(array), feelsLike: avgFeelLike(array), visibility: avgVisibility(array)})
    } 

// ------------------------------------------

    if (weatherData === undefined) {
        return <>Loading</>;
    } 

    if (forecastSt1 === undefined) {
        return <>Loading</>;
    }

    return (
        <>
        <section>
            <Header setSearchValue={setSearchValue} onSubmit={getCoords} />
            <div className="mainInfo">
                <MainInfo weatherData={weatherData} city={cityName}/>
            </div>
        </section>
        <section className="bottomSection">
            <div>
                <ForecastCard forecast={forecastSt1} avg={avgObject(forecastSt1)}/>
                <ForecastCard forecast={forecastSt2} avg={avgObject(forecastSt2)}/>
                <ForecastCard forecast={forecastSt3} avg={avgObject(forecastSt3)}/>
            </div>
        </section>
        </>
    )
}