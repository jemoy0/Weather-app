import "./footer.css"

export const Footer = () => {
    return (
        <footer>
            <span className="logo">Wthr</span>
            <div>
                <a href={"https://github.com/jemoy0/Weather-app"} target="_blank" rel="noreferrer">GitHub</a>
                <a href={"https://openweathermap.org/"} target="_blank" rel="noreferrer">OpenWeather</a>
            </div>
        </footer>
    )
}