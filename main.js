import SurfingMap from './SurfingMap.js';
import WeatherData from './WeatherData.js';

const weatherApiKey = 'WEATHERBIT_API_KEY';
const weatherData = new WeatherData(weatherApiKey);

const apiKey = "GMAP_API_KEY";
const surfingMap = new SurfingMap(apiKey, weatherData, handleLocation);


async function handleLocation(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  // Update weather data
  const weatherInfo = await weatherData.fetchWeatherData(lat, lng);
  weatherData.updateWeatherInfo(weatherInfo);

  // Update the map
  surfingMap.setCenter({ lat, lng });
  surfingMap.addUserMarker({ lat, lng });
}
