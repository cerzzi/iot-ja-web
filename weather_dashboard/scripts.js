let currentView = 'temperature';
let chartInstance = null;
let currentCity = { name: 'Tampere', lat: 61.4978, lon: 23.7610 };

async function suggestCities() {
    const cityInput = document.getElementById('cityInput').value.trim();
    const suggestionsList = document.getElementById('citySuggestions');
    
    if (cityInput.length < 2) {
        suggestionsList.style.display = 'none';
        suggestionsList.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}`);
        const data = await response.json();
        suggestionsList.innerHTML = '';
        
        if (data.results && data.results.length > 0) {
            data.results.slice(0, 5).forEach(city => {
                const displayName = `${city.name}, ${city.country || ''}`.trim();
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = displayName;
                li.onclick = () => {
                    document.getElementById('cityInput').value = city.name;
                    suggestionsList.style.display = 'none';
                    currentCity = {
                        name: city.name,
                        lat: city.latitude,
                        lon: city.longitude
                    };
                    fetchWeatherData();
                };
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching city suggestions:', error);
        suggestionsList.style.display = 'none';
    }
}

async function searchCity() {
    const cityInput = document.getElementById('cityInput').value.trim();
    if (!cityInput) return;

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const city = data.results[0]; // Take the first result
            currentCity = {
                name: city.name,
                lat: city.latitude,
                lon: city.longitude
            };
            document.getElementById('citySuggestions').style.display = 'none';
            fetchWeatherData();
        } else {
            alert('City not found!');
        }
    } catch (error) {
        console.error('Error fetching city:', error);
        alert('Error searching for city');
    }
}

async function fetchWeatherData() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${currentCity.lat}&longitude=${currentCity.lon}&hourly=temperature_2m,rain,windspeed_10m&past_days=30&current_weather=true`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeatherData(data);
        displayCurrentWeather(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data');
    }
}

function displayCurrentWeather(data) {
    const currentWeather = data.current_weather;
    document.getElementById('currentCity').textContent = currentCity.name;
    document.getElementById('currentTemp').textContent = `${currentWeather.temperature.toFixed(1)} °C`;
    document.getElementById('currentWind').textContent = `${(currentWeather.windspeed / 3.6).toFixed(1)} m/s`;
    document.getElementById('currentRain').textContent = `${data.hourly.rain[data.hourly.rain.length - 1].toFixed(1)} mm`;
    document.getElementById('currentWeather').style.display = 'block';
}

function calculateStatistics(values) {
    if (!values || values.length === 0) return null;

    // Mean
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

    // Median
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    // Mode
    const frequency = {};
    let maxFreq = 0;
    let mode = [];
    values.forEach(val => {
        frequency[val] = (frequency[val] || 0) + 1;
        if (frequency[val] > maxFreq) {
            maxFreq = frequency[val];
            mode = [val];
        } else if (frequency[val] === maxFreq) {
            mode.push(val);
        }
    });
    const modeText = mode.length === values.length ? 'No mode' : mode.join(', ');

    // Range
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    // Standard Deviation
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return { mean, median, mode: modeText, range, stdDev, min, max };
}

function displayWeatherData(data) {
    const now = new Date(); // Current date and time
    // Filter timestamps to include only past and present data
    const validData = data.hourly.time
        .map((time, index) => ({ time, index }))
        .filter(({ time }) => new Date(time) <= now)
        .map(({ index }) => ({
            time: data.hourly.time[index],
            temperature: data.hourly.temperature_2m[index],
            rain: data.hourly.rain[index],
            windspeed: data.hourly.windspeed_10m[index] / 3.6 // Convert km/h to m/s
        }));

    // Select data for the current view
    let values, unit, title, header;
    switch (currentView) {
        case 'temperature':
            values = validData.map(d => d.temperature);
            unit = '°C';
            title = `Temperature in ${currentCity.name}`;
            header = 'Temperature (°C)';
            break;
        case 'rain':
            values = validData.map(d => d.rain);
            unit = 'mm';
            title = `Rain in ${currentCity.name}`;
            header = 'Rain (mm)';
            break;
        case 'windspeed':
            values = validData.map(d => d.windspeed);
            unit = 'm/s';
            title = `Wind Speed in ${currentCity.name}`;
            header = 'Wind Speed (m/s)';
            break;
    }

    // Calculate averages for different periods
    const nowValue = values[values.length - 1] || 0;
    const latest20Avg = values.slice(-20).reduce((sum, val) => sum + val, 0) / Math.min(20, values.length) || 0;
    const last24Avg = values.slice(-24).reduce((sum, val) => sum + val, 0) / Math.min(24, values.length) || 0;
    const last48Avg = values.slice(-48).reduce((sum, val) => sum + val, 0) / Math.min(48, values.length) || 0;
    const last72Avg = values.slice(-72).reduce((sum, val) => sum + val, 0) / Math.min(72, values.length) || 0;
    const lastWeekAvg = values.slice(-168).reduce((sum, val) => sum + val, 0) / Math.min(168, values.length) || 0;
    const lastMonthAvg = values.reduce((sum, val) => sum + val, 0) / values.length || 0;

    // Update view title
    document.getElementById('viewTitle').textContent = title;

    // Update table
    document.getElementById('now').textContent = `${nowValue.toFixed(1)} ${unit}`;
    document.getElementById('latest20').textContent = `${latest20Avg.toFixed(1)} ${unit}`;
    document.getElementById('last24').textContent = `${last24Avg.toFixed(1)} ${unit}`;
    document.getElementById('last48').textContent = `${last48Avg.toFixed(1)} ${unit}`;
    document.getElementById('last72').textContent = `${last72Avg.toFixed(1)} ${unit}`;
    document.getElementById('lastWeek').textContent = `${lastWeekAvg.toFixed(1)} ${unit}`;
    document.getElementById('lastMonth').textContent = `${lastMonthAvg.toFixed(1)} ${unit}`;

    // Calculate statistics for each period
    const periods = [
        { name: 'Now', data: [nowValue] },
        { name: 'Latest 20 Readings', data: values.slice(-20) },
        { name: '24 Hours', data: values.slice(-24) },
        { name: '48 Hours', data: values.slice(-48) },
        { name: '72 Hours', data: values.slice(-72) },
        { name: '1 Week', data: values.slice(-168) },
        { name: '1 Month', data: values }
    ];

    const statsHtml = periods.map(period => {
        const stats = calculateStatistics(period.data);
        if (!stats) return '';
        return `
            <h5>${period.name}</h5>
            <table class="table table-bordered">
                <tbody>
                    <tr><td>Mean</td><td>${stats.mean.toFixed(1)} ${unit}</td></tr>
                    <tr><td>Median</td><td>${stats.median.toFixed(1)} ${unit}</td></tr>
                    <tr><td>Mode</td><td>${stats.mode === 'No mode' ? stats.mode : `${stats.mode} ${unit}`}</td></tr>
                    <tr><td>Range</td><td>${stats.range.toFixed(1)} ${unit}</td></tr>
                    <tr><td>Standard Deviation</td><td>${stats.stdDev.toFixed(1)} ${unit}</td></tr>
                    <tr><td>Minimum</td><td>${stats.min.toFixed(1)} ${unit}</td></tr>
                    <tr><td>Maximum</td><td>${stats.max.toFixed(1)} ${unit}</td></tr>
                </tbody>
            </table>
        `;
    }).join('');

    document.getElementById('statistics').innerHTML = statsHtml;

    // Update chart (show last 20 readings for consistency)
    const last20Data = validData.slice(-20);
    if (chartInstance) chartInstance.destroy();
    const ctx = document.getElementById('weatherChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last20Data.map(d => new Date(d.time).toLocaleTimeString()),
            datasets: [{
                label: header,
                data: last20Data.map(d => d[currentView === 'temperature' ? 'temperature' : currentView === 'rain' ? 'rain' : 'windspeed']),
                borderColor: '#88C0D0', // Nord8
                backgroundColor: 'rgba(136, 192, 208, 0.2)', // Nord8 with opacity
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: { display: true, text: unit, color: '#D8DEE9' },
                    grid: { color: '#4C566A' },
                    ticks: { color: '#D8DEE9' }
                },
                x: {
                    title: { display: true, text: 'Time', color: '#D8DEE9' },
                    grid: { color: '#4C566A' },
                    ticks: { color: '#D8DEE9' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#D8DEE9' }
                }
            }
        }
    });
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.textContent.toLowerCase().includes(view));
    });
    fetchWeatherData();
}

// Initial load
fetchWeatherData();