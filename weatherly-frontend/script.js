// ========================================
// API CONFIGURATION
// ========================================
const API_BASE_URL = "https://weatherly-backend-4y84.onrender.com";
let currentLocation = "vijayawada";
let isFahrenheit = false;


// ========================================
// CURRENT WEATHER
// ========================================

function fetchWeather(location) {

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    fetch(`${API_BASE_URL}/api/weather?city=${encodeURIComponent(location)}`)
        .then(response => {
            return response.json();
        })
        .then(data => {

            loading.style.display = "none";

            // ----------------------------------------
            // Current Weather Details
            // ----------------------------------------

            let temperatureValue;

            if (isFahrenheit) {
                temperatureValue = data.current.temp_f;
            } else {
                temperatureValue = data.current.temp_c;
            }

            temperature.textContent = Math.round(temperatureValue) + "°";

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
        `${API_BASE_URL}/api/forecast?city=${encodeURIComponent(location)}`;

    fetch(url)
        .then(response => {

            if (!response.ok) {
                throw new Error("Forecast data could not be loaded");
            }

            return response.json();
        })
        .then(data => {

            // ========================================
            // 7-DAY FORECAST
            // ========================================

            const sunrise = document.getElementById("sunrise");
            const sunset = document.getElementById("sunset");

            sunrise.textContent = data.forecast.forecastday[0].astro.sunrise;
            sunset.textContent = data.forecast.forecastday[0].astro.sunset;

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

                let maxTemp;
                let minTemp;

                if (isFahrenheit) {
                    maxTemp = day.day.maxtemp_f;
                    minTemp = day.day.mintemp_f;
                } else {
                    maxTemp = day.day.maxtemp_c;
                    minTemp = day.day.mintemp_c;
                }

                card.querySelector(".forecast-temp").textContent =
                    `${Math.round(maxTemp)}° / ${Math.round(minTemp)}°`;

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

                    let hourTemperature;

                    if (isFahrenheit) {
                        hourTemperature = hour.temp_f;
                    } else {
                        hourTemperature = hour.temp_c;
                    }

                    hourTemp.textContent =
                        Math.round(hourTemperature) + "°";

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

        })
        .catch(error => {

            console.error(error);

        });
}

fetchForecast(currentLocation);


// ========================================
// WEATHER MAP
// ========================================

const map =
    L.map("weather-map").setView([16.5062, 80.6480], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const marker =
    L.marker([16.5062, 80.6480]).addTo(map);


// ========================================
// LOCATION SEARCH
// ========================================

const searchInput =
    document.getElementById("search-input");

searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        searchInput.placeholder = "Search city";

        const location =
            searchInput.value.trim();

        if (location === "") {
            return;
        }

        fetch(`${API_BASE_URL}/api/search?city=${encodeURIComponent(location)}`)
            .then(response => {

                if (!response.ok) {
                    throw new Error("Weather data could not be loaded");
                }

                return response.json();
            })
            .then(data => {

                if (data.length === 0) {
                    alert("Location not found.");
                    return;
                }

                const latitude = data.location.lat;
                const longitude = data.location.lon;

                currentLocation = data[0].name;
                searchInput.value = "";

                // Move map

                map.setView([latitude, longitude], 10);

                // Move marker

                marker.setLatLng([latitude, longitude]);

                // Update weather

                fetchWeather(currentLocation);
                fetchForecast(currentLocation);
            })
            .catch(error => {

                searchInput.placeholder = "Search city...";

                console.error(error);

                alert("Unable to load weather data.");

            });
    }
});


// ========================================
// POPULAR CITIES
// ========================================

const cityItems =
    document.querySelectorAll(".city-item");

cityItems.forEach(item => {

    item.addEventListener("click", function() {

        const city =
            item.dataset.city;

        currentLocation = city;

        // Remove active class from all cities

        cityItems.forEach(cityItem => {
            cityItem.classList.remove("active-city");
        });

        // Add active class to clicked city

        item.classList.add("active-city");

        fetch(`${API_BASE_URL}/api/weather?city=${encodeURIComponent(city + ", India")}`)
            .then(response => response.json())
            .then(data => {

                const latitude = data[0].lat;
                const longitude = data[0].lon;

                // Move map

                map.setView([latitude, longitude], 10);

                // Move marker

                marker.setLatLng([latitude, longitude]);

                // Update weather

                fetchWeather(currentLocation);
                fetchForecast(currentLocation);
            });
    });
});


// ========================================
// POPULAR CITIES WEATHER
// ========================================

function fetchPopularCitiesWeather() {

    cityItems.forEach(item => {

        const city =
            item.dataset.city;

        fetch(`${API_BASE_URL}/api/weather?city=${encodeURIComponent(city + ", India")}`)
            .then(response => response.json())
            .then(data => {

                const temperature =
                    item.querySelector(".city-temperature");

                const condition =
                    item.querySelector(".city-condition");

                let cityTemperature;

                if (isFahrenheit) {
                    cityTemperature = data.current.temp_f;
                } else {
                    cityTemperature = data.current.temp_c;
                }

                temperature.textContent =
                    Math.round(cityTemperature) + "°";

                condition.textContent =
                    data.current.condition.text;
            });
    });
}

fetchPopularCitiesWeather();


// ========================================
// CURRENT DATE
// ========================================

const dateElement =
    document.getElementById("weather-date");

const today =
    new Date();

dateElement.textContent =
    today.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });


// ========================================
// TEMPERATURE UNIT
// ========================================

const unitToggle =
    document.getElementById("unit-toggle");

unitToggle.addEventListener("click", function() {

    isFahrenheit = !isFahrenheit;

    unitToggle.classList.toggle("active");

    fetchWeather(currentLocation);
    fetchForecast(currentLocation);
    fetchPopularCitiesWeather();
});


// ========================================
// DASHBOARD NAVIGATION
// ========================================

const dashboardNav =
    document.getElementById("dashboard-nav");

dashboardNav.addEventListener("click", function() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});