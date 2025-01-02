
const API_KEY = 'a9b68e77dfada43b4bbf97ce84df4835';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const currentLocationBtn = document.getElementById('current-location');
const weatherDisplay = document.getElementById('weather-display');
const extendedForecast = document.getElementById('extended-forecast');
const forecastCards = document.getElementById('forecast-cards');
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const recentCitiesDropdown = document.getElementById('recent-cities-dropdown');


// Fetch Weather Data by City Name
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    displayCurrentWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
    saveCityToLocalStorage(city); // Save city to local storage
    updateRecentCitiesDropdown(); // Update dropdown
  } catch (error) {
    alert(error.message);
  }
}

// Fetch Weather Data by Location
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

    // Filter Forecast for 1 per Day
    const dailyForecast = data.list.filter((item) => item.dt_txt.includes("12:00:00"));
    displayForecast(dailyForecast);
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
}

// Display Current Weather
function displayCurrentWeather(data) {
  document.getElementById('city-name').innerText = data.name;
  document.getElementById('current-weather').innerText = capitalize(data.weather[0].description);
  document.getElementById('temperature').innerText = data.main.temp;
  document.getElementById('humidity').innerText = data.main.humidity;
  document.getElementById('wind-speed').innerText = data.wind.speed;

  // Apply updated styles
  weatherDisplay.classList.remove('hidden');
  weatherDisplay.classList.add('bg-gray-700', 'text-white', 'p-6', 'rounded-lg', 'shadow-lg');
}

// Display 5-Day Forecast
function displayForecast(forecast) {
  forecastCards.innerHTML = '';

  forecast.forEach(day => {
    const card = document.createElement('div');
    card.classList.add(
      'p-6',
      'bg-gray-800',
      'rounded-lg',
      'shadow-md',
      'text-center',
      'text-white'
    );

    card.innerHTML = `
      <h4 class="font-bold text-lg text-purple-400">${new Date(day.dt_txt).toDateString()}</h4>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon" class="mx-auto">
      <p class="text-lg">${day.main.temp}°C</p>
      <p>${day.wind.speed} km/h Wind</p>
      <p>${day.main.humidity}% Humidity</p>
    `;
    forecastCards.appendChild(card);
  });

  extendedForecast.classList.remove('hidden');
  extendedForecast.classList.add('bg-gray-700', 'p-6', 'rounded-lg', 'shadow-lg');
}

// Save City to Local Storage
function saveCityToLocalStorage(city) {
  let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!cities.includes(city)) {
    cities.unshift(city);// add to the biginning
    if(cities.length>5) cities.pop()
    localStorage.setItem('recentCities', JSON.stringify(cities));
  }
}

// Update Recently Searched Cities Dropdown
function updateRecentCitiesDropdown() {
  const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  recentCitiesDropdown.innerHTML = '<option value="">Select a recent city</option>'; // Reset dropdown

  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    recentCitiesDropdown.appendChild(option);
  });
}

// Event Listeners for Search
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  } else {
    alert('Please enter a city name');
  }
});

// Event Listener for Current Location
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

// Event Listener for Recent Cities Dropdown
/*recentCitiesDropdown.addEventListener('change', (e) => {
  const selectedCity = e.target.value;
  if (selectedCity) {
    fetchWeatherByCity(selectedCity);
  }
});*/

// Clear recent cities from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('recentCities'); // Clear recent cities
  // or use localStorage.clear(); // This will clear all local storage items
});

// Helper function to capitalize text
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Initialize recent cities dropdown on page load
document.addEventListener('DOMContentLoaded', updateRecentCitiesDropdown);

  
  
  

// Function to save city to local storage
function saveCityToLocalStorage(city) {
  let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!cities.includes(city)) {
    cities.unshift(city); // Add to the beginning of the array
    if (cities.length > 5) cities.pop(); // Keep only the last 5 searches
    localStorage.setItem('recentCities', JSON.stringify(cities));
  }
}

// Function to update the dropdown menu
function updateRecentCitiesDropdown() {
  const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  recentCitiesDropdown.innerHTML = '<option value="">Select a recent city</option>'; // Reset dropdown

  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    recentCitiesDropdown.appendChild(option);
  });

  // Show the dropdown if there are cities
  recentCitiesDropdown.classList.toggle('hidden', cities.length === 0);
}

// Event listener for search form submission
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    saveCityToLocalStorage(city);
    updateRecentCitiesDropdown();
    fetchWeatherByCity(city); // Function to fetch weather data
  } else {
    alert('Please enter a city name');
  }
});

// Event listener for recent cities dropdown
recentCitiesDropdown.addEventListener('change', (e) => {
  const selectedCity = e.target.value;
  if (selectedCity) {
    fetchWeatherByCity(selectedCity); // Function to fetch weather data
  }
});

// Initialize recent cities dropdown on page load
document.addEventListener('DOMContentLoaded', updateRecentCitiesDropdown);
