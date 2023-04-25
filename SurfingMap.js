class SurfingMap {
  constructor(apiKey, handleLocationCallback) {
    this.apiKey = apiKey;
    this.handleLocation = handleLocationCallback;
    this.loadScript();
  }

  async initMap() {
    const defaultLocation = { lat: -34.397, lng: 150.644 };
    this.map = new google.maps.Map(document.getElementById("map-container"), {
      zoom: 10,
      center: defaultLocation,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleLocation,
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

  setCenter(center) {
    this.map.setCenter(center);
  }

  addUserMarker(center) {
    const userMarker = new google.maps.Marker({
      position: center,
      map: this.map,
      title: "Your location",
    });
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
