/**
 * Class representing weather data fetched from Open-Meteo API.
 */
class WeatherData {
  /**
   * Create a new WeatherData instance.
   */
  constructor() {
    this.baseUrl = "https://api.open-meteo.com/v1/forecast";
  }

  /**
   * Fetch weather data for the given coordinates.
   * @param {number} lat - The latitude of the location.
   * @param {number} lon - The longitude of the location.
   * @returns {Promise<Object|null>} A promise that resolves to the weather data or null if an error occurs.
   */
  async fetchWeatherData(lat, lon) {
    try {
      const response = await fetch(
        `${this.baseUrl}?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  }

  async fetchArrivalWeatherData(lat, lon, arrivalHourIndex) {
    try {
      const response = await fetch(
        `${this.baseUrl}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,windspeed_10m,winddirection_10m&timezone=auto`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch arrival weather data");
      }
      const data = await response.json();
      // Извлекаем прогноз погоды на час прибытия
      const arrivalWeather = {
        temperature: data.hourly.temperature_2m[arrivalHourIndex],
        windSpeed: data.hourly.windspeed_10m[arrivalHourIndex],
        windDirection: data.hourly.winddirection_10m[arrivalHourIndex],
      };

      return arrivalWeather;
    } catch (error) {
      console.error("Error fetching arrival weather data:", error);
      return null;
    }
  }



  /**
   * Update the weather information displayed on the page.
   * @param {Object|null} weatherData - The weather data to display or null if an error occurred.
   */
    /**
   * Update the weather information displayed on the page.
   * @param {Object|null} weatherData - The weather data to display or null if an error occurred.
   * @param {Object|null} arrivalWeatherData - The arrival weather data to display or null if an error occurred.
   */
  updateWeatherInfo(weatherData, arrivalWeatherData) {
      const weatherInfoElement = document.getElementById("weather-info");
      if (!weatherData || !weatherData.current_weather) {
        weatherInfoElement.innerHTML = "<p>Unable to load weather data.</p>";
        return;
      }

      const currentWeather = weatherData.current_weather;
      const windDirection = currentWeather.winddirection;

      // Создаем SVG-стрелку с нужным поворотом
      const windArrow = (direction) => `<svg width="30" height="30" viewBox="0 0 24 24">
        <g transform="rotate(${direction - 90}, 12, 12)">
          <path d="M12 2L12 22" stroke="black" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 2L10 6" stroke="black" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 2L14 6" stroke="black" stroke-width="2" stroke-linecap="round"/>
        </g>
      </svg>`;

      const currentWeatherHtml = `
        <h2>Current Weather</h2>
        <p>Temperature: ${currentWeather.temperature}°C</p>
        <p>Wind Speed: ${currentWeather.windspeed} m/s</p>
        <p>Wind Direction: ${windArrow(windDirection)} (${windDirection}°)</p>
      `;

      let arrivalWeatherHtml = "";
      if (arrivalWeatherData) {
        arrivalWeatherHtml = `
          <h2>Weather at Arrival</h2>
          <p>Temperature: ${arrivalWeatherData.temperature}°C</p>
          <p>Wind Speed: ${arrivalWeatherData.windSpeed} m/s</p>
          <p>Wind Direction: ${windArrow(arrivalWeatherData.windDirection)} (${arrivalWeatherData.windDirection}°)</p>
        `;
      } else {
        arrivalWeatherHtml = "<p>Unable to load arrival weather data.</p>";
      }

      weatherInfoElement.innerHTML = currentWeatherHtml + arrivalWeatherHtml;
    }

}

export default WeatherData;
