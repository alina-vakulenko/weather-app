function getUnit() {
  let unit = "metric";
  let imperialLink = document.querySelector("#imperial");
  if (imperialLink.classList.contains("active")) {
    unit = "imperial";
  }
  return unit;
}
function formatDate(timezone) {
  let currentTime = new Date();
  let localTime = currentTime.getTime();
  let localOffset = currentTime.getTimezoneOffset() * 60000;
  let localCityTime = new Date(localTime + localOffset + 1000 * timezone);
  let day = days[localCityTime.getDay()];
  let hours = localCityTime.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = localCityTime.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let month = months[localCityTime.getMonth()];
  let dayNumber = localCityTime.getDate();
  return {
    date: `${month} ${dayNumber}`,
    dayName: day,
    time: `${hours}:${minutes}`,
  };
}
function formatTimestamp(timestamp) {
  let currentTime = new Date(timestamp * 1000);
  let day = days[currentTime.getDay()];
  return day;
}
function displayCurrentDate(timezone) {
  let date = document.querySelector("#date");
  let dayAndTime = document.querySelector("#day-and-time");
  let formattedDate = formatDate(timezone);
  date.innerHTML = formattedDate.date;
  dayAndTime.innerHTML = `${formattedDate.dayName} ${formattedDate.time}`;
}
function displayForecast(responce) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  let dailyForecast = responce.data.daily;
  dailyForecast.forEach(function (forecastDay, index) {
    if (index > 5) {
      return;
    }
    forecastHTML += `
   <div class="col">
      <div class="forecast-day">
        <strong>${formatTimestamp(forecastDay.dt)}</strong>
        <img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" alt="forecast-icon" class="forecast-icon" id="forecast-icon" />
        <div clas="forecast-temp-max" id="forecast-temp-max">${Math.round(
          forecastDay.temp.max
        )}°</div>
        <div class="forecast-temp-min" id="forecast-temp-min">${Math.round(
          forecastDay.temp.min
        )}°</div>
      </div>
    </div>
      `;
  });
  forecastHTML = `<div class="row">` + forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = "b35c686ba9565ba0ab254c2230937552";
  let units = getUnit();
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}
function displayWeatherConditions(responce) {
  document.querySelector("#current-city").innerHTML = responce.data.name;
  document.querySelector("#current-temperature").innerHTML = `${Math.round(
    responce.data.main.temp
  )}<span class="unit">${unitMeasure[getUnit()].temp}</span>`;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${responce.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", responce.data.weather[0].description);
  document.querySelector("#description").innerHTML =
    responce.data.weather[0].description;
  document.querySelector("#wind").innerHTML = `${Math.round(
    responce.data.wind.speed
  ).toFixed(1)} ${unitMeasure[getUnit()].windSpeed}`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${responce.data.main.humidity} %`;
  displayCurrentDate(responce.data.timezone);
  getForecast(responce.data.coord);
}
function searchCity(city) {
  let apiKey = "7d478f69e1b2f5d563653f13f5f91d76";
  let units = getUnit();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherConditions);
}
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-field").value;
  if (city === "") {
    city = defaultCity;
  }
  searchCity(city);
}
function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "7d478f69e1b2f5d563653f13f5f91d76";
  let units = getUnit();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherConditions);
  document.querySelector("#input-field").value = "";
}
function searchCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
function putCityInInput(city) {
  city.addEventListener("click", function (event) {
    event.preventDefault();
    let inputCity = document.querySelector("#input-field");
    inputCity.value = event.target.innerHTML;
  });
}
function switchToMetric() {
  metricLink.classList.add("active");
  imperialLink.classList.remove("active");
  let city = document.querySelector("#current-city").innerHTML;
  searchCity(city);
}
function switchToImperial() {
  metricLink.classList.remove("active");
  imperialLink.classList.add("active");
  let city = document.querySelector("#current-city").innerHTML;
  searchCity(city);
}
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let defaultCity = "Kyiv";
let unitMeasure = {
  metric: { windSpeed: "meter/sec", temp: "℃" },
  imperial: { windSpeed: "miles/hour", temp: "℉" },
};
let searchForm = document.querySelector("#search-form");
let currentLocationButton = document.querySelector("#current-location-button");
let popularCities = document.querySelectorAll("#city");
let metricLink = document.querySelector("#metric");
let imperialLink = document.querySelector("#imperial");
popularCities.forEach(putCityInInput);
searchForm.addEventListener("submit", handleSubmit);
currentLocationButton.addEventListener("click", searchCurrentPosition);
metricLink.addEventListener("click", switchToMetric);
imperialLink.addEventListener("click", switchToImperial);
searchCity(defaultCity);
