class SurfingMap {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.loadScript();
  }

  async initMap() {
    const defaultLocation = { lat: -34.397, lng: 150.644 };
    const map = new google.maps.Map(document.getElementById("map-container"), {
      zoom: 10,
      center: defaultLocation,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(center);

          const userMarker = new google.maps.Marker({
            position: center,
            map: map,
            title: "Your location",
          });

          const weatherInfo = await weatherData.fetchWeatherData(center.lat, center.lng);
          console.log(weatherInfo);

          weatherData.updateWeatherInfo(weatherInfo);
          // Здесь можно добавить маркеры для ближайших пляжей с помощью цикла или других методов
        },
        (error) => {
          console.log(error);
          console.log("Geolocation permission denied, using default location");
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation not supported, using default location");
    }
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

export default SurfingMap;