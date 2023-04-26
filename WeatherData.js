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

  /**
   * Update the weather information displayed on the page.
   * @param {Object|null} weatherData - The weather data to display or null if an error occurred.
   */
  updateWeatherInfo(weatherData) {
    const weatherInfoElement = document.getElementById("weather-info");
    if (!weatherData || !weatherData.current_weather) {
      weatherInfoElement.innerHTML = "<p>Unable to load weather data.</p>";
      return;
    }

    const currentWeather = weatherData.current_weather;
    const htmlContent = `
      <h2>Current Weather</h2>
      <p>Temperature: ${currentWeather.temperature}°C</p>
      <p>Wind Speed: ${currentWeather.windspeed} m/s</p>
      <p>Wind Direction: ${currentWeather.winddirection}°</p>
    `;
    weatherInfoElement.innerHTML = htmlContent;
  }

}

export default WeatherData;
