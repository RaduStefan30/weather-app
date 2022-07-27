import axios from "axios";
import Moment from "react-moment";
import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { WiDayCloudy } from "react-icons/wi";
import {
  BsCloudRain,
  BsCloudSnow,
  BsCloudy,
  BsMoon,
  BsSun,
} from "react-icons/bs";

function App() {
  const city = localStorage.getItem("search") || "Bacau";
  const [search, setSearch] = useState(city);
  const [itemSearch, setItemSearch] = useState();
  const [searchItems, setSearchItems] = useState();
  const [weather, setWeather] = useState("");
  const [image, setImage] = useState("sunny");
  const [icon, setIcon] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const inputField = useRef();
  const weatherDiv = useRef();

  const animateChange = (elRef, timer) => {
    elRef.current.animate(
      {
        opacity: [0, 1],
      },
      timer
    );
  };

  const getWeather = async () => {
    try {
      const response = await axios(
        `http://api.weatherapi.com/v1/forecast.json?key=d925b139295c421486175329222707&q=${search}&days=3&aqi=no&alerts=no`
      );
      setWeather(response.data);
      setIsLoading(false);
    } catch (err) {
      if (localStorage.getItem("search")) {
        localStorage.removeItem("search");
        getWeather();
      }
    }
    inputField.current.value = "";
    setSearchItems();
  };

  const getSearch = async () => {
    try {
      const response = await axios(
        `http://api.weatherapi.com/v1/search.json?key=d925b139295c421486175329222707&q=${itemSearch}`
      );
      setSearchItems(response.data.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWeather();
    localStorage.setItem("search", search);
  }, [search]);

  useEffect(() => {
    if (itemSearch) getSearch();
  }, [itemSearch]);

  useEffect(() => {
    if (weather) {
      if (!weather.current.is_day) {
        setImage("night");
        setIcon(<BsMoon />);
      } else if (weather.current.temp_c <= 0) {
        setImage("snow");
        setIcon(<BsCloudSnow />);
      } else if (weather.current.precip_mm > 0.5) {
        setImage("rain");
        setIcon(<BsCloudRain />);
      } else if (weather.current.cloud > 75) {
        setImage("cloudy");
        setIcon(<BsCloudy />);
      } else if (weather.current.cloud >= 25 && weather.current.cloud <= 75) {
        setImage("partial");
        setIcon(<WiDayCloudy />);
      } else {
        setImage("sunny");
        setIcon(<BsSun />);
      }
      animateChange(weatherDiv, 600);
    }
  }, [weather]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(inputField.current.value);
  };

  const handleClick = (e) => {
    if (e.length > 2) {
      setSearch(e);
    }
  };

  const handleChange = (e) => {
    setItemSearch(e.target.value);
    if (e.length > 2) {
      getSearch();
    }
  };

  if (isLoading) return;
  <main style={{ backgroundImage: `url(${image}.jpg)` }}></main>;

  return (
    <main style={{ backgroundImage: `url(${image}.jpg)` }}>
      <div className="left">
        <div className="weather-big" ref={weatherDiv}>
          <h1 className="temperature-big">
            {Math.round(weather.current.temp_c)}°
          </h1>

          <h2 className="city-big">
            {weather.location.name} {icon}
          </h2>

          <h6 className="city-date-big">
            <Moment format="DD MMM YYYY HH:mm">
              {weather.location.localtime}
            </Moment>
          </h6>
        </div>
      </div>
      <div className="right" onSubmit={handleSubmit}>
        <form className="search-form">
          <input
            className="search-input"
            ref={inputField}
            onChange={handleChange}
          ></input>
          <button type="submit" className="search-btn">
            <FiSearch />
          </button>
        </form>
        {searchItems && searchItems.length > 2 && (
          <div className="suggestions">
            {searchItems.map((item) => (
              <p
                key={item.id}
                onClick={() => handleClick(item.name)}
                onChange={() => handleChange(item.name)}
              >
                {item.name}, {item.region}, {item.country}
              </p>
            ))}
          </div>
        )}
        <div className="weather-small hide" ref={weatherDiv}>
          <h3 className="weather-small-city">
            {weather.location.name} {icon}
          </h3>
          <h3 className="weather-small-temp">
            {Math.round(weather.current.temp_c)}°
          </h3>
          <h6 className="weather-small-date">
            <Moment format="DD MMM YYYY HH:mm">
              {weather.location.localtime}
            </Moment>
          </h6>
        </div>
        <div className="weather-details">
          <h3 className="weather-details-title">Weather Details</h3>
          <div className="details">
            <span className="label">Feels like</span>
            <span className="text">{weather.current.feelslike_c} °</span>
          </div>
          <div className="details">
            <span className="label">Clouds</span>
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
        <div className="weather-details">
          {weather.forecast.forecastday.map((item) => (
            <div key={item.date_epoch}>
              <h3 className="weather-details-title">
                <Moment format="DD MMM">{item.date}</Moment>
              </h3>
              <div className="details">
                <span className="label">Max Temperature</span>
                <span className="text">{item.day.maxtemp_c}°</span>
              </div>
              <div className="details">
                <span className="label">Average Temperature</span>
                <span className="text">{item.day.avgtemp_c}°</span>
              </div>
              <div className="details">
                <span className="label">Wind</span>
                <span className="text">{item.day.max_wind_kph} km/h</span>
              </div>
              <div className="details">
                <span className="label">Chance of rain</span>
                <span className="text">{item.day.daily_chance_of_rain} %</span>
              </div>
              <div className="details">
                <span className="label">Chance of snow</span>
                <span className="text">{item.day.daily_chance_of_snow} %</span>
              </div>
              <div className="details">
                <span className="label">Humidity</span>
                <span className="text">{item.day.avghumidity} %</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
