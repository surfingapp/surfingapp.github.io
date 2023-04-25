import EventManager from './EventManager.js';

class SurfingMap {
  constructor(apiKey, weatherData, handleLocationCallback) {
    this.apiKey = apiKey;
    this.weatherData = weatherData;
    this.bbox = [-10.5, -175.5, 22, -154];
    this.handleLocation = handleLocationCallback;
    this.loadScript();
  }

  async initMap() {
    const defaultLocation = { lat: -34.397, lng: 150.644 };

    try {
      const position = await this.getUserLocation();
      const { latitude, longitude } = position.coords;
      this.handleLocation(position);
      this.updateBbox(latitude, longitude);
    } catch {
      const { lat, lng } = defaultLocation;
      this.updateBbox(lat, lng);
    }

    this.map = new google.maps.Map(document.getElementById("map-container"), {
      zoom: 10,
      center: defaultLocation,
    });

    this.eventManager = new EventManager(this, this.weatherData);

    this.addBeachMarkers(await this.fetchBeaches());
  }

  async fetchBeaches() {
    const overpassApiUrl = 'https://overpass-api.de/api/interpreter';
    const overpassQuery = `
      [out:json];
      (
        node["natural"="beach"](${this.bbox.join(",")});
        way["natural"="beach"](${this.bbox.join(",")});
        relation["natural"="beach"](${this.bbox.join(",")});
      );
      out center;
    `;

    try {
      const response = await fetch(overpassApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            console.log(error);
            console.log("Geolocation permission denied, using default location");
            reject();
          },
          { enableHighAccuracy: true }
        );
      } else {
        console.log("Geolocation not supported, using default location");
        reject();
      }
    });
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

  updateBbox(lat, lng, range = 1) {
    this.bbox = [lat - range, lng - range, lat + range, lng + range];
  }


  loadScript() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    window.initMap = () => this.initMap();
  }

  async addBeachMarkers(beaches) {
    for (const beach of beaches) {
      const beachMarker = new google.maps.Marker({
        position: { lat: parseFloat(beach.lat), lng: parseFloat(beach.lon) },
        map: this.map,
        title: beach.name,
        icon: {
          url: 'https://cdn-icons-png.flaticon.com/512/430/430788.png',
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      // Use EventManager to handle beach marker clicks
      this.eventManager.handleBeachMarkerClick(beachMarker, (marker, isActive) => {
        this.setBeachMarkerSize(marker, isActive);
      });
    }
  }

  setBeachMarkerSize(marker, isActive) {
    const size = isActive ? 60 : 40;
    marker.setIcon({
      url: 'https://cdn-icons-png.flaticon.com/512/430/430788.png',
      scaledSize: new google.maps.Size(size, size),
    });
  }




}

export default SurfingMap;
