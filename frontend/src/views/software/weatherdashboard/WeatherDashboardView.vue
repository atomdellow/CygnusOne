<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '../../../assets/styles/software/weatherdashboard/weatherdashboard.css';

const router = useRouter();
const searchQuery = ref('');
const selectedLocation = ref({});
const currentWeather = ref(null);
const forecast = ref([]);
const locations = ref([]);
const loading = ref(false);
const unit = ref('celsius'); // celsius or fahrenheit
const error = ref('');

// Mock weather data
const mockLocations = [
  { id: 1, name: 'New York', country: 'USA' },
  { id: 2, name: 'London', country: 'UK' },
  { id: 3, name: 'Tokyo', country: 'Japan' },
  { id: 4, name: 'Paris', country: 'France' },
  { id: 5, name: 'Sydney', country: 'Australia' }
];

const mockWeatherData = {
  1: { // New York
    temp: 22,
    condition: 'Sunny',
    humidity: 45,
    windSpeed: 12,
    forecast: [
      { day: 'Mon', temp: 22, condition: 'Sunny' },
      { day: 'Tue', temp: 24, condition: 'Partly Cloudy' },
      { day: 'Wed', temp: 21, condition: 'Cloudy' },
      { day: 'Thu', temp: 19, condition: 'Rain' },
      { day: 'Fri', temp: 20, condition: 'Partly Cloudy' }
    ]
  },
  2: { // London
    temp: 18,
    condition: 'Cloudy',
    humidity: 78,
    windSpeed: 15,
    forecast: [
      { day: 'Mon', temp: 18, condition: 'Cloudy' },
      { day: 'Tue', temp: 17, condition: 'Rain' },
      { day: 'Wed', temp: 16, condition: 'Rain' },
      { day: 'Thu', temp: 18, condition: 'Cloudy' },
      { day: 'Fri', temp: 19, condition: 'Partly Cloudy' }
    ]
  },
  3: { // Tokyo
    temp: 28,
    condition: 'Clear',
    humidity: 65,
    windSpeed: 8,
    forecast: [
      { day: 'Mon', temp: 28, condition: 'Clear' },
      { day: 'Tue', temp: 29, condition: 'Sunny' },
      { day: 'Wed', temp: 30, condition: 'Sunny' },
      { day: 'Thu', temp: 27, condition: 'Partly Cloudy' },
      { day: 'Fri', temp: 26, condition: 'Cloudy' }
    ]
  },
  4: { // Paris
    temp: 20,
    condition: 'Partly Cloudy',
    humidity: 55,
    windSpeed: 10,
    forecast: [
      { day: 'Mon', temp: 20, condition: 'Partly Cloudy' },
      { day: 'Tue', temp: 22, condition: 'Sunny' },
      { day: 'Wed', temp: 23, condition: 'Sunny' },
      { day: 'Thu', temp: 21, condition: 'Clear' },
      { day: 'Fri', temp: 20, condition: 'Partly Cloudy' }
    ]
  },
  5: { // Sydney
    temp: 24,
    condition: 'Sunny',
    humidity: 50,
    windSpeed: 18,
    forecast: [
      { day: 'Mon', temp: 24, condition: 'Sunny' },
      { day: 'Tue', temp: 25, condition: 'Sunny' },
      { day: 'Wed', temp: 23, condition: 'Partly Cloudy' },
      { day: 'Thu', temp: 22, condition: 'Cloudy' },
      { day: 'Fri', temp: 21, condition: 'Rain' }
    ]
  }
};

const convertTemp = (temp) => {
  if (unit.value === 'fahrenheit') {
    return Math.round((temp * 9/5) + 32);
  }
  return temp;
};

const displayTemp = computed(() => {
  if (!currentWeather.value) return '';
  return `${convertTemp(currentWeather.value.temp)}°${unit.value === 'celsius' ? 'C' : 'F'}`;
});

const toggleUnit = () => {
  unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius';
};

const searchLocations = () => {
  if (!searchQuery.value.trim()) {
    locations.value = [];
    return;
  }
  
  loading.value = true;
  
  // Simulate API call with timeout
  setTimeout(() => {
    const query = searchQuery.value.toLowerCase();
    locations.value = mockLocations.filter(
      location => location.name.toLowerCase().includes(query) ||
                 location.country.toLowerCase().includes(query)
    );
    loading.value = false;
  }, 500);
};

const selectLocation = (location) => {
  selectedLocation.value = location;
  searchQuery.value = `${location.name}, ${location.country}`;
  locations.value = [];
  
  loading.value = true;
  
  // Simulate API call to get weather data
  setTimeout(() => {
    const weatherData = mockWeatherData[location.id];
    if (weatherData) {
      currentWeather.value = {
        temp: weatherData.temp,
        condition: weatherData.condition,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed
      };
      forecast.value = weatherData.forecast;
    } else {
      error.value = 'Weather data not available for this location';
    }
    loading.value = false;
  }, 800);
};

const getWeatherIcon = (condition) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return '☀️';
    case 'partly cloudy':
      return '⛅';
    case 'cloudy':
      return '☁️';
    case 'rain':
      return '🌧️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    default:
      return '🌤️';
  }
};

// Load New York by default
onMounted(() => {
  selectLocation(mockLocations[0]);
});

const goBack = () => {
  router.push({ name: 'software' });
};
</script>

<template>
  <div class="app-wrapper">
    <div class="app-container">
      <div class="app-header">
        <button @click="goBack" class="btn btn-back">← Back to Software</button>
        <h1>Weather Dashboard</h1>
        <p class="app-description">Real-time weather information and forecasts</p>
      </div>
      
      <div class="weather-app">
        <div class="search-section">
          <div class="search-container">
            <input
              type="text"
              class="search-input"
              v-model="searchQuery"
              @input="searchLocations"
              placeholder="Search for a location..."
            />
            
            <div v-if="locations.length > 0" class="search-results">
              <div
                v-for="location in locations"
                :key="location.id"
                class="location-item"
                @click="selectLocation(location)"
              >
                {{ location.name }}, {{ location.country }}
              </div>
            </div>
          </div>
          
          <button @click="toggleUnit" class="unit-toggle">
            Switch to {{ unit === 'celsius' ? 'Fahrenheit' : 'Celsius' }}
          </button>
        </div>
        
        <div v-if="loading" class="loading">
          <div class="loader"></div>
          <p>Loading weather data...</p>
        </div>
        
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-else-if="currentWeather" class="weather-content">
          <div class="current-weather">
            <div class="weather-icon" v-html="getWeatherIcon(currentWeather.condition)"></div>
            <div class="weather-info">
              <h2>{{ selectedLocation.name }}, {{ selectedLocation.country }}</h2>
              <div class="temperature">{{ displayTemp }}</div>
              <div class="condition">{{ currentWeather.condition }}</div>
              <div class="details">
                <span>Humidity: {{ currentWeather.humidity }}%</span>
                <span>Wind: {{ currentWeather.windSpeed }} km/h</span>
              </div>
            </div>
          </div>
          
          <div class="forecast-section">
            <h3>5-Day Forecast</h3>
            <div class="forecast">
              <div 
                v-for="(day, index) in forecast" 
                :key="index" 
                class="forecast-day"
              >
                <div class="day">{{ day.day }}</div>
                <div class="forecast-icon" v-html="getWeatherIcon(day.condition)"></div>
                <div class="forecast-temp">{{ convertTemp(day.temp) }}°</div>
                <div class="forecast-condition">{{ day.condition }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
