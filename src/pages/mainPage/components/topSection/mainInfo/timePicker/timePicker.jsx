import "./timePicker.css"

export const TimePicker = ({forecast, value1, onChange}) => {
    return (
        <div className="selectTime">
            <select
                value={value1}
                onChange={e => onChange(e.target.value, forecast)}
            >
                <option value={"current"}>Зараз</option>
                {forecast.map((el, id) => (
                    <option key={id} value={id}>{(new Date(el.dt*1000).getHours() > 9 ? new Date(el.dt*1000).getHours() : "0" + new Date(el.dt*1000).getHours()) + ":00"}</option>
                ))}
            </select>
        </div>
    )
}