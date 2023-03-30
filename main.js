class SurfingMap {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.initMap();
  }

  initMap() {
    const center = { lat: -34.397, lng: 150.644 };
    const map = new google.maps.Map(document.getElementById("map-container"), {
      zoom: 10,
      center: center,
    });

    const userMarker = new google.maps.Marker({
      position: center,
      map: map,
      title: "Ваше местоположение",
    });

    // Здесь можно добавить маркеры для ближайших пляжей с помощью цикла или других методов
  }

  loadScript() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
}

const apiKey = "YOUR_API_KEY";
const surfingMap = new SurfingMap(apiKey);
surfingMap.loadScript();
