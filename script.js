// DOM Elements (убираем forecastContainer)
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('location-search');
const currentTemp = document.getElementById('currentTemp');
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherEmoji = document.getElementById('weatherEmoji'); // может быть null — проверяем при использовании
const weatherDescription = document.getElementById('weatherDescription');
const tempMax = document.getElementById('tempMax');
const tempMin = document.getElementById('tempMin');
const humidity = document.getElementById('humidity');
const cloudiness = document.getElementById('cloudiness');
const windSpeed = document.getElementById('windSpeed');
const hourlyContainer = document.getElementById('hourlyContainer'); // оставляем почасовой
const loader = document.getElementById('loader');
const errorBox = document.getElementById('error');

// Background images mapping (place files in the project's photo/ folder)
const BG_IMAGES = {
  thunder: 'photo/Гроза.Webp',
  rain: 'photo/Ливневый дождь.jpg',
  snow: 'photo/Легкий снег.jpg',
  clear: 'photo/ясно, погода.jpg',
  cloudy: 'photo/Переменная облачность.jpg',
  fog: 'photo/Туман.jpg',
  fallback: 'photo/Сильный снег.jpg' // запасной фон
};

// Base path to your local Weather Icons Kit (relative to index.html)
const ICON_BASE = './Weather  Icons Kit (Community) (2)/32';

// Minimal WEATHER map (icons optional)
const WEATHER = {
  0:  { text: "CLEAR SKY", icon: `${ICON_BASE}/Sunny/Off.png` },
  1:  { text: "MAINLY CLEAR", icon: `${ICON_BASE}/Cloudy-clear at times/Off.png` },
  2:  { text: "PARTLY CLOUDY", icon: `${ICON_BASE}/Cloudy-clear at times/Off.png` },
  3:  { text: "OVERCAST", icon: `${ICON_BASE}/Cloudy/Off.png` },
  45: { text: "FOG", icon: `${ICON_BASE}/Fog/Off.png` },
  48: { text: "DEPOSITING RIME FOG", icon: `${ICON_BASE}/Fog/Off.png` },
  51: { text: "LIGHT DRIZZLE", icon: `${ICON_BASE}/Rain/Off.png` },
  53: { text: "MODERATE DRIZZLE", icon: `${ICON_BASE}/Rain/Off.png` },
  55: { text: "DENSE DRIZZLE", icon: `${ICON_BASE}/Rain/Off.png` },
  61: { text: "SLIGHT RAIN", icon: `${ICON_BASE}/Rain/Off.png` },
  63: { text: "MODERATE RAIN", icon: `${ICON_BASE}/Rain/Off.png` },
  65: { text: "HEAVY RAIN", icon: `${ICON_BASE}/Rain/Off.png` },
  71: { text: "SLIGHT SNOW", icon: `${ICON_BASE}/Snow/Off.png` },
  73: { text: "MODERATE SNOW", icon: `${ICON_BASE}/Snow/Off.png` },
  75: { text: "HEAVY SNOW", icon: `${ICON_BASE}/Snow/Off.png` },
  80: { text: "SLIGHT RAIN SHOWERS", icon: `${ICON_BASE}/Rain/Off.png` },
  95: { text: "THUNDERSTORM", icon: `${ICON_BASE}/Sever-thunderstorm/Off.png` }
};

// DEBUG: проверяем, что элементы найдены
console.log('DOM elements:', {
  searchForm,
  searchInput,
  loader,
  hourlyContainer
});

// Event Listeners
if (searchForm) {
  searchForm.addEventListener('submit', handleSearch);
  console.log('searchForm submit listener attached');
} else {
  console.error('searchForm not found — submit listener not attached');
}

function handleSearch(e) {
  e.preventDefault();
  const city = searchInput?.value?.trim();
  console.log('handleSearch called, city:', city);
  if (!city) {
    showError("Please enter a city name");
    return;
  }
  loadWeatherData(city);
}

// Helper to format hour label
function formatHour(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

// Set background image according to weather code
function setBackgroundByWeather(code) {
  const imgEl = document.querySelector('.bg-weather .img');
  if (!imgEl) return;

  let src = BG_IMAGES.fallback;

  // Thunderstorm
  if ([95, 96, 99].includes(code)) {
    src = BG_IMAGES.thunder;
  }
  // Rain / drizzle
  else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    src = BG_IMAGES.rain;
  }
  // Snow
  else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    src = BG_IMAGES.snow;
  }
  // Fog
  else if (code === 45 || code === 48) {
    src = BG_IMAGES.fog;
  }
  // Clear
  else if (code === 0) {
    src = BG_IMAGES.clear;
  }
  // Cloudy / partly
  else if (code === 1 || code === 2 || code === 3) {
    src = BG_IMAGES.cloudy;
  }

  // Apply src with encoding; add simple onerror fallback
  try {
    imgEl.src = encodeURI(src);
  } catch (e) {
    imgEl.src = BG_IMAGES.fallback;
  }
  imgEl.onerror = () => { imgEl.src = BG_IMAGES.fallback; };
}

// Main function
async function loadWeatherData(city) {
  try {
    toggleLoading(true);
    hideError();

    // Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error("Geocoding error");
    const geoData = await geoRes.json();
    const place = geoData?.results?.[0];
    if (!place) throw new Error("City not found");
    const { latitude, longitude, name, country } = place;

    // Forecast with hourly + current (убираем daily из запроса)
    const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code,relativehumidity_2m,windspeed_10m&timezone=auto`;
    const wRes = await fetch(wUrl);
    if (!wRes.ok) throw new Error("Weather data error");
    const wData = await wRes.json();

    // Для tempMax и tempMin будем использовать текущие значения
    updateCurrentWeather({ name, country }, wData.current);
    if (wData.hourly) updateHourlyForecast(wData.hourly);
  } catch (err) {
    console.error(err);
    showError(err.message || "Something went wrong");
  } finally {
    toggleLoading(false);
  }
}

// Update current weather (без daily параметра)
function updateCurrentWeather(place, current) {
  const label = `${place.name}${place.country ? ", " + place.country : ""}`;
  const code = current?.weather_code;
  const wm = WEATHER[code] || { text: "UNKNOWN" };

  cityName.textContent = label;
  currentTemp.textContent = current?.temperature_2m != null ? Math.round(current.temperature_2m) + "°" : "—";
  if (weatherEmoji) weatherEmoji.textContent = ""; // убираем значок
  weatherDescription.textContent = wm.text || "—";

  humidity.textContent = current?.relative_humidity_2m != null ? Math.round(current.relative_humidity_2m) + "%" : "—";
  windSpeed.textContent = current?.wind_speed_10m != null ? Math.round(current.wind_speed_10m) + " km/h" : "—";

  // Для tempMax и tempMin используем текущую температуру
  tempMax.textContent = current?.temperature_2m != null ? Math.round(current.temperature_2m) + "°" : "—";
  tempMin.textContent = current?.temperature_2m != null ? Math.round(current.temperature_2m) + "°" : "—";

  const cloudValue = (code >= 2 && code <= 3) ? "86%" : (code === 1) ? "25%" : "15%";
  cloudiness.textContent = cloudValue;

  // смена фона в зависимости от кода погоды
  setBackgroundByWeather(code);

  const now = new Date();
  currentDate.textContent = now.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  currentDate.setAttribute('datetime', now.toISOString());
}

// New: render hourly forecast (next 24 hours from now)
function updateHourlyForecast(hourly) {
  if (!hourlyContainer) return;
  while (hourlyContainer.firstChild) hourlyContainer.removeChild(hourlyContainer.firstChild);

  const times = hourly.time; // array of ISO strings
  const temps = hourly.temperature_2m;
  const codes = hourly.weather_code;
  const now = new Date();

  // find first index >= now
  let start = times.findIndex(t => new Date(t) >= now);
  if (start < 0) start = 0;

  const count = Math.min(24, times.length - start);
  for (let i = 0; i < count; i++) {
    const idx = start + i;
    const timeLabel = formatHour(times[idx]);
    const temp = temps[idx] != null ? Math.round(temps[idx]) + "°" : "—";
    const code = codes?.[idx];
    const desc = WEATHER[code]?.text || "";

    const el = document.createElement('div');
    el.className = 'hourly-item';
    el.innerHTML = `
      <div class="hour">${timeLabel}</div>
      <div class="temp">${temp}</div>
      <div class="desc">${desc}</div>
    `;
    hourlyContainer.appendChild(el);
  }
}

// Helpers: UI
function toggleLoading(show) {
  loader.style.display = show ? 'block' : 'none';
}
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
  console.error("Error displayed:", msg);
}
function hideError() {
  errorBox.textContent = "";
  errorBox.style.display = 'none';
}

// Init
console.log("Initializing weather app...");
loadWeatherData("Bishkek");
