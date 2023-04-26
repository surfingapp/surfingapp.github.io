/**
 * Class representing an event manager for handling user interactions with the surfing map.
 */
class EventManager {
  /**
   * Create a new EventManager instance.
   * @param {SurfingMap} surfingMap - The SurfingMap instance to handle events for.
   * @param {WeatherData} weatherData - The WeatherData instance to fetch weather data.
   */
  constructor(surfingMap, weatherData) {
    this.surfingMap = surfingMap;
    this.weatherData = weatherData;
    this.initEventListeners();
  }

  /**
   * Initialize event listeners for the surfing map.
   */
  initEventListeners() {
    this.surfingMap.map.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      console.log(`Clicked coordinates: ${lat}, ${lng}`);
    });
  }

  /**
   * Handle beach marker click events.
   * @param {google.maps.Marker} marker - The beach marker that was clicked.
   * @param {function} callback - A callback function to be called when the marker is clicked.
   */
  async handleBeachMarkerClick(marker, callback) {
    marker.addListener('click', async () => {
      if (this.surfingMap.activeBeachMarker && this.surfingMap.activeBeachMarker !== marker) {
        callback(this.surfingMap.activeBeachMarker, false);
      }
      callback(marker, true);
      this.surfingMap.activeBeachMarker = marker;

      const lat = marker.getPosition().lat();
      const lng = marker.getPosition().lng();
      const weatherData = await this.weatherData.fetchWeatherData(lat, lng);
      this.weatherData.updateWeatherInfo(weatherData);

      const travelTime = await this.surfingMap.fetchTravelTime(
        this.surfingMap.userMarker.getPosition(),
        marker.getPosition()
      );
      console.log('Travel time (in seconds):', travelTime);
    });
  }
}

export default EventManager;
