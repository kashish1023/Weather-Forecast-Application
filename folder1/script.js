// script.js

// Replace with your API key
const API_KEY = 'a9b68e77dfada43b4bbf97ce84df4835';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentLocationBtn = document.getElementById('current-location');
const recentSearches = document.getElementById('recent-searches');
const weatherDisplay = document.getElementById('weather-display');
const extendedForecast = document.getElementById('extended-forecast');
const forecastCards = document.getElementById('forecast-cards');

// Fetch Weather Data by City Name
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    displayCurrentWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
  } catch (error) {
    alert(error.message);
  }
}

// Fetch Weather Data by Current Location
async function fetchWeatherByLocation(lat, lon) {
  try {
    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    if (!response.ok) throw new Error('Location not found');
    const data = await response.json();
    displayCurrentWeather(data);
    fetchForecast(lat, lon);
  } catch (error) {
    alert(error.message);
  }
}

// Fetch 5-Day Forecast
async function fetchForecast(lat, lon) {
  try {
    const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    displayForecast(data.list);
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
}

// Display Current Weather
function displayCurrentWeather(data) {
  document.getElementById('city-name').innerText = data.name;
  document.getElementById('current-weather').innerText = data.weather[0].description;
  document.getElementById('temperature').innerText = data.main.temp;
  document.getElementById('humidity').innerText = data.main.humidity;
  document.getElementById('wind-speed').innerText = data.wind.speed;
  weatherDisplay.classList.remove('hidden');
}

// Display 5-Day Forecast
function displayForecast(forecast) {
  forecastCards.innerHTML = '';
  const dailyForecast = forecast.filter((item, index) => index % 8 === 0);

  dailyForecast.forEach(day => {
    const card = document.createElement('div');
    card.classList.add('p-4', 'bg-white', 'rounded-lg', 'shadow-md', 'text-center');
    card.innerHTML = `
      <h4 class="font-bold text-lg">${new Date(day.dt_txt).toDateString()}</h4>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
      <p>${day.main.temp}°C</p>
      <p>${day.wind.speed} km/h</p>
      <p>${day.main.humidity}% Humidity</p>
    `;
    forecastCards.appendChild(card);
  });
  extendedForecast.classList.remove('hidden');
}

// Event Listeners
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  } else {
    alert('Please enter a city name');
  }
});

currentLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByLocation(latitude, longitude);
      },
      () => alert('Unable to fetch location')
    );
  } else {
    alert('Geolocation is not supported by your browser');
  }
});
