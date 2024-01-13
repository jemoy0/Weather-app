import { useEffect, useRef, useState } from "react"
import { Header } from "./header"
import { MainInfo } from "./mainInfo"
import "./index.css"

export const MainPage = () => {
    const [json0, setJson0] = useState()
    const [coords, setCoords] = useState()
    const [cityName, setCityName] = useState()
    const [searchValue, setSearchValue] = useState()
    const [weatherData, setWeatherData] = useState()

// Верхня секція

    //Стандартна локація (Лондон) (В планах зробити запит про локацію користувача при заході на сайт)
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=51.509865&lon=-0.118092&units=metric&lang=uk&appid=7ac3df89aa900441a1d739cbd173fb5e`);
            const json = await response.json()
            setWeatherData(json)
            setCityName("Лондон")
        }
        fetchData();
    }, []); 
    

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

    // setCoords змінює значення лише після закінчення функції getWeatherData, тому єдине що залишається це використати useEffect 
    const isInitialMount = useRef(true)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            getWeatherData()
            console.log(weatherData)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coords])
    // console.log(weatherData)

// Нижня секція

    if (weatherData === undefined) {
        return <>Loading</>;
    }

    return (
        <section>
            <Header setSearchValue={setSearchValue} onSubmit={getCoords} />
            <div className="mainInfo">
                <MainInfo weatherData={weatherData} city={cityName}/>
            </div>
        </section>
    )
}