// Coordinates for Tampere, Finland
const LATITUDE = 61.4978;
const LONGITUDE = 23.7610;
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weathercode&hourly=temperature_2m,weathercode&timezone=Europe/Helsinki`;

// Weather code to Flaticon icon class mapping
function getWeatherIcon(code) {
    const iconMap = {
        0: "fi-bs-sun",              // Clear sky
        1: "fi-bs-cloud-sun",        // Mainly clear
        2: "fi-bs-cloud-sun",        // Partly cloudy
        3: "fi-bs-cloud",            // Overcast
        45: "fi-bs-fog",             // Fog
        51: "fi-bs-cloud-drizzle",   // Light drizzle
        61: "fi-bs-cloud-rain",      // Light rain
        63: "fi-bs-cloud-rain",      // Moderate rain
        65: "fi-bs-cloud-rain",      // Heavy rain
        71: "fi-bs-snowflake",       // Light snow
        73: "fi-bs-snowflake",       // Moderate snow
        75: "fi-bs-snowflake",       // Heavy snow
        95: "fi-bs-cloud-bolt"       // Thunderstorm
    };
    return iconMap[code] || "fi-bs-sun"; // Default to sun if unknown
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        51: "Light drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        95: "Thunderstorm"
    };
    return weatherCodes[code] || "Unknown";
}

async function fetchWeather() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        // Current Weather
        const currentTemp = data.current.temperature_2m;
        const currentCode = data.current.weathercode;
        const currentTime = new Date(data.current.time).toLocaleString("en-US", { timeZone: "Europe/Helsinki" });

        document.getElementById("current-temp").textContent = `Temperature: ${currentTemp}°C`;
        document.getElementById("current-condition").textContent = `Condition: ${getWeatherDescription(currentCode)}`;
        document.getElementById("current-time").textContent = `Last Updated: ${currentTime}`;

        // Add current weather icon
        const currentIconDiv = document.getElementById("current-icon");
        currentIconDiv.innerHTML = `<i class="fi ${getWeatherIcon(currentCode)}"></i>`;

        // Forecast (5 days at 14:00)
        const forecastContainer = document.getElementById("forecast");
        forecastContainer.innerHTML = "<h2>Forecast</h2>"; // Reset content

        const hourlyTimes = data.hourly.time;
        const hourlyTemps = data.hourly.temperature_2m;
        const hourlyCodes = data.hourly.weathercode;

        // Get the first hour and calculate offset to the next 14:00
        const firstHour = new Date(hourlyTimes[0]).getHours();
        let offsetTo14 = (14 - firstHour + 24) % 24; // Hours until next 14:00
        if (offsetTo14 < 0) offsetTo14 += 24; // Ensure positive offset

        // Show forecast for 14:00 each day, up to 5 days
        for (let i = offsetTo14; i < Math.min(120 + offsetTo14, hourlyTimes.length); i += 24) {
            const time = new Date(hourlyTimes[i]).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
            const temp = hourlyTemps[i];
            const code = hourlyCodes[i];

            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card");
            forecastCard.innerHTML = `
                <h3>${time} 14:00</h3>
                <div class="weather-icon"><i class="fi ${getWeatherIcon(code)}"></i></div>
                <p>Temperature: ${temp}°C</p>
                <p>Condition: ${getWeatherDescription(code)}</p>
            `;
            forecastContainer.appendChild(forecastCard);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById("current-temp").textContent = "Error fetching data";
    }
}

// Initial fetch and update every 15 minutes (900,000 ms)
fetchWeather();
setInterval(fetchWeather, 900000);