const apiKey = "YOUR_API_KEY";

function initMap() {
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

//window.addEventListener("load", initMap);

// Замените эту строку на следующую:
// <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
script.async = true;
script.defer = true;
document.body.appendChild(script);