// OpenWeather API settings
const API_KEY = 'API'; // Replace with your OpenWeather API key
const CITY = 'Tampere,FI';
const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`;

// DOM elements
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const weatherIconEl = document.getElementById('weather-icon');

// Global variable to hold the chart instance
let weatherChart = null;

// Fetch and display current weather
async function getCurrentWeather() {
    try {
        const response = await fetch(CURRENT_WEATHER_URL);
        if (!response.ok) throw new Error('Failed to fetch current weather');
        const data = await response.json();

        // Display current weather
        temperatureEl.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
        descriptionEl.textContent = data.weather[0].description;
        weatherIconEl.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        weatherIconEl.style.display = 'block';
    } catch (error) {
        temperatureEl.textContent = 'Error fetching weather data';
        console.error(error);
    }
}

// Fetch and display 5-day forecast with 3-hour intervals
async function getForecast() {
    try {
        const response = await fetch(FORECAST_URL);
        if (!response.ok) throw new Error('Failed to fetch forecast');
        const data = await response.json();

        // Prepare data for Chart.js: use all 3-hour interval points
        const labels = data.list.map(item => {
            const date = new Date(item.dt * 1000);
            return date.toLocaleString('en-US', { 
                weekday: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                hour12: false 
            });
        });
        const temperatures = data.list.map(item => Math.round(item.main.temp));

        // Destroy existing chart instance if it exists
        if (weatherChart) {
            weatherChart.destroy();
        }

        // Render new chart
        const ctx = document.getElementById('weatherChart').getContext('2d');
        weatherChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: '#5e81ac', // Nord10
                    backgroundColor: 'rgba(94, 129, 172, 0.2)', // Nord10 with opacity
                    fill: true,
                    tension: 0.4, // Smoother curve
                    pointRadius: 2, // Smaller points for more data
                    pointHoverRadius: 5 // Larger on hover
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { 
                            display: true, 
                            text: 'Temperature (°C)', 
                            color: '#eceff4' 
                        },
                        ticks: { 
                            color: '#d8dee9',
                            stepSize: 5 // Consistent steps for readability
                        },
                        grid: { color: 'rgba(216, 222, 233, 0.1)' } // Subtle grid
                    },
                    x: {
                        title: { 
                            display: true, 
                            text: 'Time', 
                            color: '#eceff4' 
                        },
                        ticks: {
                            color: '#d8dee9',
                            maxTicksLimit: 10, // Limit ticks for scalability
                            autoSkip: true // Automatically skip labels for readability
                        },
                        grid: { display: false } // No vertical grid lines
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '5-Day Temperature Forecast (3-Hour Intervals)',
                        color: '#eceff4',
                        font: { size: 16 }
                    },
                    legend: { 
                        display: false 
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false,
                        backgroundColor: 'rgba(46, 52, 64, 0.9)', // Nord0
                        titleColor: '#eceff4',
                        bodyColor: '#d8dee9'
                    }
                },
                interaction: {
                    mode: 'nearest',
                    intersect: false
                }
            }
        });
    } catch (error) {
        console.error('Error fetching forecast:', error);
        document.getElementById('forecast').innerHTML += '<p>Error loading forecast</p>';
    }
}

// Function to update weather data
function updateWeather() {
    getCurrentWeather();
    getForecast();
}

// Initialize the page and set up auto-update
document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch
    updateWeather();

    // Auto-update every 15 minutes (900,000 ms)
    setInterval(updateWeather, 900000);
});
