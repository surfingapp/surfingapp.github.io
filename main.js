class SurfingMap {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.loadScript();
  }

  async initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
      const center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    const map = new google.maps.Map(document.getElementById("map-container"), {
      zoom: 10,
      center: center,
    });

    const userMarker = new google.maps.Marker({
      position: center,
      map: map,
      title: "Your location",
    });

    const weatherInfo = await weatherData.fetchWeatherData(center.lat, center.lng);
    console.log(weatherInfo);

    weatherData.updateWeatherInfo(weatherInfo);
    // Здесь можно добавить маркеры для ближайших пляжей с помощью цикла или других методов
  }

  loadScript() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    window.initMap = () => this.initMap();
  }
}

class WeatherData {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.weatherbit.io/v2.0/';
  }

  async fetchWeatherData(lat, lon) {
    const response = await fetch(`${this.baseUrl}current?lat=${lat}&lon=${lon}&key=${this.apiKey}&units=M`);
    const data = await response.json();
    return data;
  }

  updateWeatherInfo(weatherData) {
    const weatherInfoElement = document.getElementById('weather-info');
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

const weatherApiKey = 'WEATHERBIT_API_KEY';
const weatherData = new WeatherData(weatherApiKey);

const apiKey = "GMAP_API_KEY";
const surfingMap = new SurfingMap(apiKey);
