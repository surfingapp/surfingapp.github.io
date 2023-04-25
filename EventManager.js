class EventManager {
  
  constructor(surfingMap, weatherData) {
    this.surfingMap = surfingMap;
    this.weatherData = weatherData;
    this.initEventListeners();
  }


  initEventListeners() {
    this.surfingMap.map.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      console.log(`Clicked coordinates: ${lat}, ${lng}`);
    });

  }

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
    });
  }




}

export default EventManager;
