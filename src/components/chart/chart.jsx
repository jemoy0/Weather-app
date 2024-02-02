import { Line } from "react-chartjs-2";
import "./chart.css";
import { CategoryPicker } from "./categoryPicker/categoryPicker";

export const Chartt = ({ data, onChange, value, options }) => {
  return (
    <div className="chartDiv" id="graph">
      <CategoryPicker onChange={onChange} value={value} />
      <Line data={data} options={options} />
    </div>
  );
};
