
import { useEffect, useState } from 'react'
import './App.css'
import PropTypes from "prop-types" 
import searchIcon from './assets/icons8-search.svg'
import sunIcon from './assets/2998117_heat_nature_shine_sun_sunny_icon.svg'
import wind from './assets/2682832_cloud_day_forecast_sun_weather_icon.svg'
import rainy from './assets/2682827_cloud_day_light bolt_rain_sun_icon.svg'
import snow from './assets/7984970_weather_snow_cloud_snowflake_snowfall_icon.svg'
import humidity from './assets/2682839_drop_forecast_humidity_precipitation_rain_icon.svg'
import windicon from './assets/7984997_weather_wind_air_clouds_sky_icon.svg'
import error_icon from './assets/3669347_outline_error_ic_icon.svg'

const WeatherDetails = ({ icon, temp, city, country, lat, lon, humidities, winds  }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Image" /></div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord"><div>
          <span className='lat'>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='lon'>Longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidity} alt="" className='icon' />
          <div className="data">
            <div className="humidity-percentage">{humidities}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windicon} alt="" className='icon' />
          <div className="data">
            <div className="wind-percentage">{winds} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}
const ErrorPage = () => {
  return (
    <>
      <div className="error-pages">
        <img src={error_icon} alt="Error" />
        <p>Enter a valid city or check the internet connectivity</p>
      </div>
    </>
  )
}
WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidities: PropTypes.number.isRequired,
  winds: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
};
function App() {
  const [icon, setIcon] = useState(sunIcon)
  const [text, setText] = useState("Chennai")
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [lat, setLat] = useState()
  const [lon, setLon] = useState()
  const [humidities, setHumididty] = useState(0)
  const [winds, setWind] = useState(0)
  const [cityNotFound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const weatherIconMap = {
    "01d": sunIcon,
    "01n": sunIcon,
    "02n": sunIcon,
    "02d": sunIcon,
    "03d": wind,
    "03n": wind,
    "04d": wind,
    "04n": wind,
    "09d": rainy,
    "09n": rainy,
    "10n": rainy,
    "13d": snow,
    "13n": snow,
  };
  const Search = async () => {
    
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}
    &appid=14f907ca0dbec7d5d52237c463e92b93&units=Metric`;
    
    try {
      let res = await fetch(url);
      let data = await res.json(); 
      console.log(data)
      if (data.cod == "404") {
        console.error("City not found")
        setCityNotFound(true)
        setLoading(false) 
      }
      setHumididty(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode]|| wind)
      setCityNotFound(false)
      setError(false)
    } catch (error) {
      console.error("An error occured:", error.message)
      
      
    } finally {
      setLoading(false)
    }
  }
  const handleCity = (e) => {
    setText(e.target.value)
  }
  const handleKeyDowm = (e) => {
    if (e.key == "Enter") {
      Search();
    }
  }
  useEffect(function () {
    Search();
},[])

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text"
            className="cityInput"
            placeholder='Search City'
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDowm}
          />
          <div className="search-icon" onClick={()=>Search()}>
            <img src={searchIcon} alt="" />
          </div>
        </div>
        
        {loading && <div className='loading-message'> Loading.....</div>}
        {cityNotFound && <div className="city-not-found">City not Found!!</div>}
        {!loading && !error && !cityNotFound ? <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lon={lon}
          winds={winds}
          humidities={humidities}
        /> : <ErrorPage/>}
        <p className='copyright'>
          Designed by <span>Saravanakumar</span>
        </p>
      </div>
    </>
  )
}

export default App
