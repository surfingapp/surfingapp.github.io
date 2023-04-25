class WeatherData {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.weatherbit.io/v2.0/';
  }

  async fetchWeatherData(lat, lon) {
    try {
      const response = await fetch(`${this.baseUrl}current?lat=${lat}&lon=${lon}&key=${this.apiKey}&units=M`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  updateWeatherInfo(weatherData) {
    const weatherInfoElement = document.getElementById('weather-info');

    if (!weatherData) {
      weatherInfoElement.innerHTML = '<p>Unable to load weather data.</p>';
      return;
    }

    const currentWeather = weatherData.data[0];
    const htmlContent = `
      <h2>Current Weather</h2>
      <p>Temperature: ${currentWeather.temp}°C</p>
      <p>Wind Speed: ${currentWeather.wind_spd} m/s</p>
      <p>Wind Direction: ${currentWeather.wind_dir}°</p>
    `;
    weatherInfoElement.innerHTML = htmlContent;
  }
}

export default WeatherData;
