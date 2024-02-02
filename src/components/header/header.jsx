import { Link, useParams } from "react-router-dom";
import "./header.css";

export const Header = (props) => {
  const params = useParams();

  return (
    <header>
      <span className="logo">Wthr</span>
      <div className="links">
        {props.state.homeButton ? (
          <Link to={"/"} state={params.city} className="link">
            На головну
          </Link>
        ) : (
          <></>
        )}
        {props.state.forecasts ? (
          <>
            <a href="#chart">Графік</a>
            <a href="#forecasts">Прогнози</a>
          </>
        ) : (
          <></>
        )}
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.onSubmit(params.city);
          }}
        >
          <input name="Search Bar" type="text" placeholder="Назва міста" onChange={(e) => props.setSearchValue(e.target.value)}></input>
          <button type="submit">Пошук</button>
        </form>
      </div>
    </header>
  );
};
