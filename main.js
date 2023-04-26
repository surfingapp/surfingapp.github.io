import SurfingMap from './SurfingMap.js';
import WeatherData from './WeatherData.js';

// The API key for the weather service
const weatherApiKey = 'd75789f86f524212a00862d3c5ea744e';

/**
 * Creates a new WeatherData instance with the given API key.
 * @type {WeatherData}
 */
const weatherData = new WeatherData();

// The API key for the Google Maps service
const apiKey = "AIzaSyAmeh9DiEPjeMFT3tLkf_d2WFX6EeO7dZ4";

/**
 * Creates a new SurfingMap instance with the given API key, WeatherData instance, and location handling function.
 * @type {SurfingMap}
 */
const surfingMap = new SurfingMap(apiKey, weatherData, handleLocation);

/**
 * Handles the user's location by updating the weather data and the map.
 * @async
 * @function handleLocation
 * @param {GeolocationPosition} position - The user's geolocation position.
 */
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
