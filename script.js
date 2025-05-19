
const WEATHER_API_KEY = "your-secret-key-here";

const searchBtn = document.getElementById("searchBtn");
const locateBtn = document.getElementById("locateBtn");
const forecastContainer = document.getElementById("forecastContainer");
const hourlyContainer = document.getElementById("hourlyContainer");

function getWeatherData(location) {
// use the key like this
const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=1`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      renderForecast([data.forecast.forecastday[0]]);
      renderHourly(data.forecast.forecastday[0].hour);
    })
    .catch((err) => {
      console.error("Error fetching weather data.", err);
    });
}

function renderForecast(days) {
  forecastContainer.innerHTML = "";
  days.forEach((day) => {
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <h3>${day.date}</h3>
      <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
      <p>${day.day.condition.text}</p>
      <p>Avg Temp: ${day.day.avgtemp_c}°C</p>
      <p>Humidity: ${day.day.avghumidity}%</p>
      <p>Air Quality: ${day.day.air_quality?.pm2_5?.toFixed(1) || 'N/A'}</p>
    `;
    forecastContainer.appendChild(card);
  });
}

function renderHourly(hours) {
  hourlyContainer.innerHTML = "";
  hours.forEach((hour) => {
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <h4>${hour.time.split(" ")[1]}</h4>
      <img src="${hour.condition.icon}" alt="${hour.condition.text}" />
      <p>${hour.condition.text}</p>
      <p>Temp: ${hour.temp_c}°C</p>
      <p>Humidity: ${hour.humidity}%</p>
    `;
    hourlyContainer.appendChild(card);
  });
}

searchBtn.addEventListener("click", () => {
  const selected = document.getElementById("citySelect").value;
  const manual = document.getElementById("manualInput").value.trim();
  const location = manual || selected;
  if (location) getWeatherData(location);
});

locateBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherData(`${lat},${lon}`);
    });
  }
});
