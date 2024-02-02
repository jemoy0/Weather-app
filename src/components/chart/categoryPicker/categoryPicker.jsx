import "./categoryPicker.css";

export const CategoryPicker = ({ value, onChange }) => {
  const labels = {
    humidity: "Вологість, %",
    temp: "Температура, °С",
    pressure: "Тиск, кПа",
    speed: "Швидкість вітру, м/с",
  };

  return (
    <div className="selectCategory">
      <select value={value} onChange={(e) => onChange(e.target.value, labels[e.target.value])}>
        <option key={1} value={"temp"}>
          Температура
        </option>
        <option key={2} value={"humidity"}>
          Вологість
        </option>
        <option key={3} value={"pressure"}>
          Тиск
        </option>
        <option key={4} value={"speed"}>
          Вітер
        </option>
      </select>
    </div>
  );
};
