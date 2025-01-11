const apiKey = 'e0bbb4ba13a3922b76536368d0d2ab46';

async function getWeather() {
  const location = document.getElementById('location').value;
  let lat, lon;

  const coordinatesRegex = /^-?\d{1,3}\.\d{1,6},\s?-?\d{1,3}\.\d{1,6}$/;
  if (coordinatesRegex.test(location)) {
    const [latitude, longitude] = location.split(',').map(coord => parseFloat(coord.trim()));
    lat = latitude;
    lon = longitude;
    document.getElementById('city-name').innerText = `Coordinates: ${latitude}, ${longitude}`;
  } else {
    const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      alert("Invalid location. Please try again.");
      return;
    }

    lat = data.coord.lat;
    lon = data.coord.lon;
    document.getElementById('city-name').innerText = `Location: ${data.name}, ${data.sys.country}`;
  }

  const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;
  const weatherResponse = await fetch(weatherUrl);
  const weatherData = await weatherResponse.json();

  displayCurrentWeather(weatherData.current);
  displayForecast(weatherData.daily);
}

function displayCurrentWeather(currentWeather) {
  const currentWeatherDiv = document.getElementById('current-weather');
  currentWeatherDiv.innerHTML = `
    <h2>Current Weather</h2>
    <p class="description">${currentWeather.weather[0].description}</p>
    <p class="temperature">${currentWeather.temp}°C</p>
    <p>Humidity: ${currentWeather.humidity}%</p>
    <p>Wind Speed: ${currentWeather.wind_speed} m/s</p>
    <img class="icon" src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="Weather Icon">
  `;
}

function displayForecast(dailyForecast) {
  const forecastDiv = document.getElementById('forecast');
  forecastDiv.innerHTML = '';

  dailyForecast.slice(1, 6).forEach(day => {  // Skip today and show next 5 days
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleString('en-us', { weekday: 'short' });

    forecastDiv.innerHTML += `
      <div class="forecast-item">
        <p><strong>${dayName}</strong></p>
        <img class="icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
        <p class="temperature">${day.temp.day}°C</p>
        <p class="description">${day.weather[0].description}</p>
      </div>
    `;
  });
}
