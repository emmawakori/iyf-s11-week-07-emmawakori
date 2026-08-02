const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const errorBox = document.getElementById("error");
const loader = document.getElementById("loader");
const weatherDisplay = document.getElementById("weather-display");
const forecastContainer = document.getElementById("forecast-container");
const recentList = document.getElementById("search-history");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("city-input");
const unitToggle = document.getElementById("unit-toggle");
const locationButton = document.getElementById("use-location");

const apiKey = "197f350042a03ff48b85ac1ed97475bf";
let currentUnits = "metric";
let latestRequestId = 0;

function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = message ? "block" : "none";
}

function showLoading(isLoading) {
  loader.style.display = isLoading ? "block" : "none";
}

function resetWeatherUI() {
  weatherDisplay.style.display = "none";
  forecastContainer.innerHTML = "";
  document.body.style.background = "#f0f0f0";
}

function getTempUnitLabel(units) {
  return units === "metric" ? "°C" : "°F";
}

function getWindUnitLabel(units) {
  return units === "metric" ? "m/s" : "mph";
}

function normalizeError(error) {
  if (error instanceof TypeError) {
    return "Network error. Please check your connection and try again.";
  }

  if (error?.message) {
    return error.message;
  }

  return "Unable to fetch weather data.";
}

function hasValidWeatherPayload(data) {
  return Boolean(
    data &&
      data.name &&
      Array.isArray(data.weather) &&
      data.weather.length &&
      data.main &&
      data.wind
  );
}

function hasValidForecastPayload(data) {
  return Boolean(data && Array.isArray(data.list));
}

function updateWeatherUI(data, units) {
  if (!hasValidWeatherPayload(data)) {
    throw new Error("Unable to display weather data.");
  }

  cityName.textContent = data.name;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;
  temperature.textContent = `${data.main.temp.toFixed(1)} ${getTempUnitLabel(units)}`;
  description.textContent = data.weather[0].description;
  feelsLike.textContent = `Feels like: ${data.main.feels_like.toFixed(1)} ${getTempUnitLabel(units)}`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind: ${data.wind.speed} ${getWindUnitLabel(units)}`;
  pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
  weatherDisplay.style.display = "block";

  const weatherMain = data.weather[0].main.toLowerCase();
  const backgrounds = {
    clear: "linear-gradient(135deg, #ffd54f, #ffb300)",
    clouds: "linear-gradient(135deg, #b0bec5, #78909c)",
    rain: "linear-gradient(135deg, #4fc3f7, #0288d1)",
    drizzle: "linear-gradient(135deg, #80deea, #00acc1)",
    snow: "linear-gradient(135deg, #e1f5fe, #81d4fa)",
    thunderstorm: "linear-gradient(135deg, #455a64, #263238)",
    mist: "linear-gradient(135deg, #cfd8dc, #90a4ae)"
  };

  document.body.style.background = backgrounds[weatherMain] || "#f0f0f0";
}

function renderForecast(forecastData, units) {
  if (!hasValidForecastPayload(forecastData)) {
    forecastContainer.innerHTML = "<p>No forecast available.</p>";
    return;
  }

  const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);
  forecastContainer.innerHTML = "";

  if (!dailyForecast.length) {
    forecastContainer.innerHTML = "<p>No forecast available.</p>";
    return;
  }

  dailyForecast.forEach((item) => {
    const card = document.createElement("div");
    card.className = "forecast-card";

    const date = new Date(item.dt * 1000).toLocaleDateString("en", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });

    const temperatureUnit = getTempUnitLabel(units);
    card.innerHTML = `
      <p class="forecast-date">${date}</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
      <p>${item.weather[0].description}</p>
      <p><strong>${item.main.temp_max.toFixed(1)} / ${item.main.temp_min.toFixed(1)} ${temperatureUnit}</strong></p>
    `;

    forecastContainer.appendChild(card);
  });
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    throw new Error("Received an invalid response from the weather service.");
  }
}

async function fetchWeatherBundle(url, fallbackMessage) {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await parseJsonResponse(response).catch(() => ({}));
    throw new Error(errorData.message || fallbackMessage);
  }

  return parseJsonResponse(response);
}

async function getWeather(city, units = currentUnits) {
  const requestId = ++latestRequestId;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;

  try {
    showLoading(true);
    showError("");
    resetWeatherUI();

    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherBundle(weatherUrl, "City not found"),
      fetchWeatherBundle(forecastUrl, "Unable to load 5-day forecast.")
    ]);

    if (requestId !== latestRequestId) {
      return;
    }

    updateWeatherUI(weatherData, units);
    renderForecast(forecastData, units);
    saveRecentSearch(city);
  } catch (error) {
    if (requestId !== latestRequestId) {
      return;
    }

    showError(normalizeError(error));
  } finally {
    if (requestId === latestRequestId) {
      showLoading(false);
    }
  }
}

function readRecentSearches() {
  try {
    const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    return Array.isArray(stored) ? stored.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(city) {
  const normalizedCity = city.trim();
  if (!normalizedCity) return;

  const searches = readRecentSearches();
  const updatedSearches = [normalizedCity, ...searches.filter((item) => item.toLowerCase() !== normalizedCity.toLowerCase())].slice(0, 5);
  localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  renderRecentSearches();
}

function renderRecentSearches() {
  recentList.innerHTML = "";
  const searches = readRecentSearches();

  searches.forEach((city) => {
    const listItem = document.createElement("li");
    listItem.textContent = city;
    listItem.addEventListener("click", () => {
      searchInput.value = city;
      getWeather(city);
    });
    recentList.appendChild(listItem);
  });
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = searchInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  getWeather(city);
});

unitToggle.addEventListener("click", () => {
  currentUnits = currentUnits === "metric" ? "imperial" : "metric";
  unitToggle.textContent = currentUnits === "metric" ? "Switch to °F" : "Switch to °C";

  if (searchInput.value.trim()) {
    getWeather(searchInput.value.trim(), currentUnits);
  }
});

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by this browser.");
    return;
  }

  const requestId = ++latestRequestId;
  showLoading(true);
  showError("");
  resetWeatherUI();

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${currentUnits}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${currentUnits}`;

      try {
        const [weatherData, forecastData] = await Promise.all([
          fetchWeatherBundle(weatherUrl, "Unable to get weather for your location."),
          fetchWeatherBundle(forecastUrl, "Unable to get weather for your location.")
        ]);

        if (requestId !== latestRequestId) {
          return;
        }

        updateWeatherUI(weatherData, currentUnits);
        renderForecast(forecastData, currentUnits);
        saveRecentSearch(weatherData.name);
        searchInput.value = weatherData.name;
      } catch (error) {
        if (requestId !== latestRequestId) {
          return;
        }

        showError(normalizeError(error));
      } finally {
        if (requestId === latestRequestId) {
          showLoading(false);
        }
      }
    },
    (error) => {
      if (requestId !== latestRequestId) {
        return;
      }

      showLoading(false);
      showError(error.code === 1 ? "Location permission was denied." : "Unable to determine your location.");
    }
  );
});

renderRecentSearches();
