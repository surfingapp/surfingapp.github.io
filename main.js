import SurfingMap from './SurfingMap.js';
import WeatherData from './WeatherData.js';

const weatherApiKey = 'WEATHERBIT_API_KEY';
const weatherData = new WeatherData(weatherApiKey);

const apiKey = "GMAP_API_KEY";
const surfingMap = new SurfingMap(apiKey);
