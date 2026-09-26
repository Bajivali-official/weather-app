// ========================================
// API CONFIGURATION
// ========================================

const api = "API_KEY";
let currentLocation = "vijayawada";


// ========================================
// CURRENT WEATHER
// ========================================

function fetchWeather(location) {

    fetch(`https://api.weatherapi.com/v1/current.json?key=${api}&q=${location}`)
        .then(response => {
            return response.json();
        })
        .then(data => {

            // ----------------------------------------
            // Current Weather Details
            // ----------------------------------------

            const temperature = document.getElementById("temperature");
            temperature.textContent = data.current.temp_c + "°";

            const condition = document.getElementById("condition");
            condition.textContent = data.current.condition.text;

            const locationElement = document.getElementById("location");
            locationElement.textContent = data.location.name;


            // ----------------------------------------
            // Weather Statistics
            // ----------------------------------------

            const humidity = document.getElementById("humidity");
            humidity.textContent = data.current.humidity;

            const wind = document.getElementById("wind");
            wind.textContent = data.current.wind_kph;

            const uv = document.getElementById("uv");
            uv.textContent = data.current.uv;

            const pressure = document.getElementById("pressure");
            pressure.textContent = data.current.pressure_mb;


            // ----------------------------------------
            // Today's Highlights
            // ----------------------------------------

            const humidityValue = document.getElementById("humidity-value");
            humidityValue.textContent = data.current.humidity + " %";

            const windvalue = document.getElementById("wind-value");
            windvalue.textContent = data.current.wind_kph + " kph";

            const uvvalue = document.getElementById("uv-value");
            uvvalue.textContent = data.current.uv;

            const pressureValue = document.getElementById("pressure-value");
            pressureValue.textContent = data.current.pressure_mb;

            const visibility = document.getElementById("visibility");
            visibility.textContent = data.current.vis_km + " km";

        });
}


// ========================================
// INITIAL WEATHER LOAD
// ========================================

fetchWeather(currentLocation);

// ========================================
// FORECAST
// ========================================

function fetchForecast(location) {

    const url =
        `https://api.weatherapi.com/v1/forecast.json?key=${api}&q=${location}&days=7`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            // ========================================
            // 7-DAY FORECAST
            // ========================================

            const forecastCards =
                document.querySelectorAll(".forecast-day");

            data.forecast.forecastday.forEach((day, index) => {

                const card = forecastCards[index];

                let dayname;

                if (index === 0) {

                    dayname = "Today";

                } else {

                    const date = new Date(day.date);

                    dayname = date.toLocaleDateString("en-US", {
                        weekday: "short"
                    });

                }

                card.querySelector(".day-name").textContent =
                    dayname;

                card.querySelector(".forecast-temp").textContent =
                    `${Math.round(day.day.maxtemp_c)}° / ${Math.round(day.day.mintemp_c)}°`;

                card.querySelector(".forecast-condition").textContent =
                    day.day.condition.text;

                card.querySelector(".forecast-icon").innerHTML =
                    `<img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">`;

            });


            // ========================================
            // HOURLY FORECAST
            // ========================================

            const hourCards =
                document.querySelectorAll(".hour-item");

            const todayHours =
                data.forecast.forecastday[0].hour;

            const tomorrowHours =
                data.forecast.forecastday[1].hour;

            const hours =
                todayHours.concat(tomorrowHours);

            const localTime =
                new Date(data.location.localtime);

            const currentHour =
                localTime.getHours();

            const startIndex =
                currentHour;


            // ----------------------------------------
            // Display Next 6 Hours
            // ----------------------------------------

            hours
                .slice(startIndex, startIndex + 6)
                .forEach((hour, index) => {

                    const card = hourCards[index];


                    // Weather Icon

                    const hourIcon =
                        card.querySelector(".hour-icon");

                    hourIcon.innerHTML =
                        `<img src="https:${hour.condition.icon}" alt="${hour.condition.text}">`;


                    // Temperature

                    const hourTemp =
                        card.querySelector(".hour-temp");

                    hourTemp.textContent =
                        Math.round(hour.temp_c) + "°";


                    // Time

                    const hourTime =
                        card.querySelector(".hour-time");

                    const time =
                        new Date(hour.time.replace(" ", "T"));

                    hourTime.textContent =
                        time.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            hour12: true
                        });

                });

        });

}

fetchForecast(currentLocation);


// ========================================
// WEATHER MAP
// ========================================

const map = L.map("weather-map").setView([16.5062, 80.6480], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const marker = L.marker([16.5062, 80.6480]).addTo(map);


// ========================================
// LOCATION SEARCH
// ========================================

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        const location = searchInput.value.trim();

        if (location === "") {
            return;
        }

        fetch(`https://api.weatherapi.com/v1/search.json?key=${api}&q=${location}`)
            .then(response => response.json())
            .then(data => {

                if (data.length === 0) {
                    alert("Location not found.");
                    return;
                }

                const latitude = data[0].lat;
                const longitude = data[0].lon;

                currentLocation = data[0].name;


                // Move map

                map.setView([latitude, longitude], 10);


                // Move marker

                marker.setLatLng([latitude, longitude]);


                // Update weather

                fetchWeather(currentLocation);
                fetchForecast(currentLocation);

            })
            .catch(error =>{
                alert("something went wrong");
            })

    }

});