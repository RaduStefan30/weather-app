import axios from "axios";
import Moment from "react-moment";
import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";

function App() {
  const city = localStorage.getItem("search") || "Bacau";
  const [search, setSearch] = useState(city);
  const [weather, setWeather] = useState("");
  const [image, setImage] = useState("sunny");
  const [textColor, setTextColor] = useState("#000");
  const [isLoading, setIsLoading] = useState(true);
  const inputField = useRef();
  const weatherDiv = useRef();

  const getWeather = async () => {
    try {
      const response = await axios(
        `https://api.weatherapi.com/v1/current.json?key=d925b139295c421486175329222707&q=${search}&aqi=no`
      );
      setWeather(response.data);
      setIsLoading(false);
    } catch (err) {
      if (localStorage.getItem("search")) {
        localStorage.removeItem("search");
        getWeather();
      }
    }
  };

  useEffect(() => {
    getWeather();
    localStorage.setItem("search", search);
  }, [search]);

  useEffect(() => {
    if (weather)
      if (weather.current.precip_mm) {
        setTextColor("#fff");
        setImage("rain");
      } else if (weather.current.cloud > 75) {
        setTextColor("#fff");
        setImage("cloudy");
      } else if (weather.current.cloud > 25 && weather.current.cloud < 75) {
        setImage("partial");
      } else if (weather.current.temp_c < 0) {
        setTextColor("#000");
        setImage("snow");
      } else if (weather.current.is_day) {
        setTextColor("#000");
        setImage("sunny");
      } else {
        setTextColor("#fff");
        setImage("night");
      }
  }, [weather]);

  useEffect(() => {
    if (weather)
      weatherDiv.current.animate(
        {
          opacity: [0, 1],
        },
        600
      );
  }, [weather]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(inputField.current.value);
  };

  if (isLoading) return;
  <div>...Loading</div>;

  return (
    <main style={{ backgroundImage: `url(${image}.jpg)` }}>
      <div className="left">
        <div
          className="weather-big"
          ref={weatherDiv}
          style={{ color: textColor }}
        >
          <h1 className="temperature-big">{weather.current.temp_c}°</h1>
          <h2 className="city-big">{weather.location.name}</h2>
          <h6 className="city-date-big">
            <Moment format="DD MMM YYYY HH:mm">
              {weather.location.localtime}
            </Moment>
          </h6>
        </div>
      </div>
      <div className="right" onSubmit={handleSubmit}>
        <form className="search-form">
          <input className="search-input" ref={inputField}></input>
          <button type="submit" className="search-btn">
            <FiSearch />
          </button>
        </form>
        <div className="weather-details">
          <h3 className="weather-details-title">Weather Details</h3>
          <div className="details">
            <span className="label">Cloudy</span>
            <span className="text">{weather.current.cloud} %</span>
          </div>
          <div className="details">
            <span className="label">Humidity</span>
            <span className="text">{weather.current.humidity} %</span>
          </div>
          <div className="details">
            <span className="label">Wind</span>
            <span className="text">{weather.current.wind_kph} km/h</span>
          </div>
          <div className="details">
            <span className="label">Precipitations</span>
            <span className="text">{weather.current.precip_mm || 0} mm</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
