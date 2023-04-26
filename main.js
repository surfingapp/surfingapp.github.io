import SurfingMap from './SurfingMap.js';
import WeatherData from './WeatherData.js';

/**
 * Creates a new WeatherData instance.
 * @type {WeatherData}
 */
const weatherData = new WeatherData();

// The API key for the Google Maps service
const apiKey = "GMAP_API_KEY";

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
