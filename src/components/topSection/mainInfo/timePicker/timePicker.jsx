import { useEffect } from "react";
import "./timePicker.css";

export const TimePicker = ({ forecast, value1, onChange, state }) => {
  useEffect(() => {
    onChange[1](forecast[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="selectTime">
      {/* prettier-ignore */}
      <select
        value={value1}
        onChange={e => onChange[0](e.target.value, forecast)}
      >
        {state.current ? <option value={"current"}>Зараз</option> : <></>}
        {forecast.map((el, id) => (
            <option key={id} value={id}>{(new Date(el.dt*1000).getHours() > 9 ? new Date(el.dt*1000).getHours() : "0" + new Date(el.dt*1000).getHours()) + ":00"}</option>
        ))}
      </select>
    </div>
  );
};
