import EventManager from './EventManager.js';

/**
 * Class representing a surfing map.
 */
class SurfingMap {
  /**
   * Create a surfing map.
   * @param {string} apiKey - The Google Maps API key.
   * @param {WeatherData} weatherData - The weather data object.
   * @param {function} handleLocationCallback - The callback function to handle user location.
   */
  constructor(apiKey, weatherData, handleLocationCallback) {
    this.apiKey = apiKey;
    this.weatherData = weatherData;
    this.bbox = [-10.5, -175.5, 22, -154];
    this.handleLocation = handleLocationCallback;
    this.loadScript();
  }

  /**
   * Initialize the map.
   */
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

  /**
   * Fetch beach data from the Overpass API.
   * @return {Promise<Array>} A promise that resolves to an array of beach elements.
   */
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

  /**
   * Fetch travel time between origin and destination using Google Maps API.
   * @param {google.maps.LatLng} origin - The origin coordinates.
   * @param {google.maps.LatLng} destination - The destination coordinates.
   * @return {Promise<number|null>} A promise that resolves to the travel time in seconds or null if an error occurs.
   */
  async fetchTravelTime(origin, destination) {
    const originCoords = `${origin.lat()},${origin.lng()}`;
    const destinationCoords = `${destination.lat()},${destination.lng()}`;
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords}&destinations=${destinationCoords}&mode=driving&key=${this.apiKey}`;
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${apiUrl}`;

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch travel time');
      }
      const data = await response.json();
      console.log(data);
      const travelTime = data.rows[0].elements[0].duration.value;
      return travelTime;
    } catch (error) {
      console.error('Error fetching travel time:', error);
      return null;
    }
  }

  /**
   * Get the user's location using the Geolocation API.
   * @return {Promise<GeolocationPosition>} A promise that resolves to the user's location or rejects if an error occurs.
   */
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

  /**
   * Set the map's center.
   * @param {Object} center - The center object containing latitude and longitude.
   * @param {number} center.lat - The latitude of the center.
   * @param {number} center.lng - The longitude of the center.
   */
  setCenter(center) {
    this.map.setCenter(center);
  }

  /**
   * Add a user marker to the map.
   * @param {Object} center - The center object containing latitude and longitude.
   * @param {number} center.lat - The latitude of the center.
   * @param {number} center.lng - The longitude of the center.
   */
  addUserMarker(center) {
    this.userMarker = new google.maps.Marker({
      position: center,
      map: this.map,
      title: "Your location",
    });
  }

  /**
   * Update the bounding box for fetching beach data.
   * @param {number} lat - The latitude of the center.
   * @param {number} lng - The longitude of the center.
   * @param {number} [range=1] - The range to extend the bounding box from the center.
   */
  updateBbox(lat, lng, range = 1) {
    this.bbox = [lat - range, lng - range, lat + range, lng + range];
  }

  /**
   * Load the Google Maps API script.
   */
  loadScript() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    window.initMap = () => this.initMap();
  }

  /**
   * Add beach markers to the map.
   * @param {Array} beaches - An array of beach elements.
   */
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

  /**
   * Set the size of a beach marker.
   * @param {google.maps.Marker} marker - The marker to resize.
   * @param {boolean} isActive - Whether the marker is active or not.
   */
  setBeachMarkerSize(marker, isActive) {
    const size = isActive ? 60 : 40;
    marker.setIcon({
      url: 'https://cdn-icons-png.flaticon.com/512/430/430788.png',
      scaledSize: new google.maps.Size(size, size),
    });
  }

}

export default SurfingMap;
