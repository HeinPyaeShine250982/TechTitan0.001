/* ==========================================================================
   LIVE WEATHER HUB MODULE ENGINE (OpenWeatherMap Version)
   ========================================================================== */

// OpenWeatherMap Configuration Key
const WEATHER_API_KEY = "282efd8d5aaedeb4e9ce90d6a5d07097"; 
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

document.addEventListener("DOMContentLoaded", () => {
  initWeatherHub();
});

/**
 * Initializes Weather Module listeners and data load
 */
function initWeatherHub() {
  const searchBtn = document.getElementById("weather-search-btn");
  const cityInput = document.getElementById("weather-city-input");
  const geoBtn = document.getElementById("weather-geo-btn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const city = cityInput.value.trim();
      if (city) fetchWeatherData(city);
    });
  }

  if (cityInput) {
    cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) fetchWeatherData(city);
      }
    });
  }

  if (geoBtn) {
    geoBtn.addEventListener("click", getUserLocationWeather);
  }

  // Attach router handler after DOM loads
  setupModuleRouter();

  // Load last searched city or default location
  const savedCity = localStorage.getItem("lastSearchedCity");
  if (savedCity) {
    fetchWeatherData(savedCity);
  } else {
    getUserLocationWeather();
  }
}

/**
 * Safely handles module navigation without native alerts
 */
function setupModuleRouter() {
  const existingOpenModule = window.openModule;

  window.openModule = function (moduleName) {
    if (typeof existingOpenModule === "function") {
      existingOpenModule(moduleName);
    }

    if (moduleName === "Live Weather Hub") {
      const weatherTab = document.getElementById("weather-tab");
      if (weatherTab) {
        document.querySelectorAll(".tab-content").forEach((tab) => {
          tab.classList.add("hidden-tab");
          tab.classList.remove("active-tab");
        });
        weatherTab.classList.remove("hidden-tab");
        weatherTab.classList.add("active-tab");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };
}

/**
 * Requests Geolocation API
 */
function getUserLocationWeather() {
  if (!navigator.geolocation) {
    showWeatherError("Geolocation is not supported by your browser.");
    fetchWeatherData("London");
    return;
  }

  showWeatherError(null);
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = `${position.coords.latitude},${position.coords.longitude}`;
      fetchWeatherData(coords);
    },
    () => {
      showWeatherError("Location access denied or unavailable. Loading default city.");
      const savedCity = localStorage.getItem("lastSearchedCity") || "London";
      fetchWeatherData(savedCity);
    }
  );
}

/**
 * Fetches current weather & forecast data from OpenWeatherMap
 */
async function fetchWeatherData(query) {
  if (!WEATHER_API_KEY) {
    showWeatherError("API Key missing! Please insert your OpenWeatherMap key.");
    return;
  }

  try {
    showWeatherError(null);

    // Build Current Weather URL
    let url = `${WEATHER_BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${WEATHER_API_KEY}&units=metric`;

    // Check if input is latitude/longitude coordinates from Geolocation
    if (query.includes(",")) {
      const [lat, lon] = query.split(",");
      url = `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) throw new Error("City not found. Please verify the name.");
      if (response.status === 401) throw new Error("Invalid API Key or key is newly created (can take 1-2 hours to activate).");
      throw new Error("Unable to retrieve weather data.");
    }

    const data = await response.json();
    localStorage.setItem("lastSearchedCity", data.name);

    // Fetch 5-Day Forecast Data
    const forecastRes = await fetch(
      `${WEATHER_BASE_URL}/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastData = await forecastRes.json();

    // Render components
    renderOpenWeatherCurrent(data);
    renderOpenWeatherHourly(forecastData);
    renderOpenWeatherDaily(forecastData);
  } catch (err) {
    showWeatherError(err.message || "Network error. Check your connection.");
  }
}

/**
 * Displays error notifications
 */
function showWeatherError(msg) {
  const errBox = document.getElementById("weather-error-msg");
  if (!errBox) return;
  if (msg) {
    errBox.textContent = msg;
    errBox.classList.remove("hidden");
  } else {
    errBox.classList.add("hidden");
  }
}

/**
 * Renders main weather card
 */
function renderOpenWeatherCurrent(data) {
  document.getElementById("weather-city-name").textContent = data.name;
  document.getElementById("weather-country-code").textContent = data.sys.country;
  document.getElementById("weather-date-time").textContent = `Local Time: ${new Date().toLocaleTimeString()}`;

  document.getElementById("weather-main-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("weather-current-temp").textContent = Math.round(data.main.temp);
  document.getElementById("weather-condition-text").textContent = data.weather[0].description;
  document.getElementById("weather-feels-like").textContent = Math.round(data.main.feels_like);

  document.getElementById("weather-humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("weather-wind-speed").textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  document.getElementById("weather-wind-dir").textContent = `${data.wind.deg}°`;
  document.getElementById("weather-pressure").textContent = `${data.main.pressure} hPa`;
  document.getElementById("weather-visibility").textContent = `${(data.visibility / 1000).toFixed(1)} km`;

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  document.getElementById("weather-sunrise").textContent = sunrise;
  document.getElementById("weather-sunset").textContent = sunset;
}

/**
 * Renders 24-hour forecast
 */
function renderOpenWeatherHourly(forecastData) {
  const container = document.getElementById("weather-hourly-container");
  if (!container) return;
  container.innerHTML = "";

  // Next 8 forecast points (24 hours)
  forecastData.list.slice(0, 8).forEach((item) => {
    const timeStr = new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    container.innerHTML += `
      <div class="hourly-card">
        <div class="time">${timeStr}</div>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
        <div class="temp">${Math.round(item.main.temp)}°C</div>
        <div class="pop"><i class="fa-solid fa-droplet"></i> ${Math.round(item.pop * 100)}%</div>
      </div>
    `;
  });
}

/**
 * Renders daily outlook cards
 */
function renderOpenWeatherDaily(forecastData) {
  const container = document.getElementById("weather-daily-container");
  if (!container) return;
  container.innerHTML = "";

  // Get 1 forecast entry per day around midday
  const dailyList = forecastData.list.filter((item) => item.dt_txt.includes("12:00:00"));

  dailyList.forEach((item) => {
    const dateObj = new Date(item.dt * 1000);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    container.innerHTML += `
      <div class="daily-row">
        <div class="day-name">${dayName}</div>
        <div class="day-icon-desc">
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
          <span style="text-transform: capitalize;">${item.weather[0].description}</span>
        </div>
        <div class="rain-prob"><i class="fa-solid fa-cloud-rain"></i> ${Math.round(item.pop * 100)}%</div>
        <div class="temp-range">
          <span class="temp-max">${Math.round(item.main.temp_max)}°C</span>
          <span class="temp-min">${Math.round(item.main.temp_min)}°C</span>
        </div>
      </div>
    `;
  });
}