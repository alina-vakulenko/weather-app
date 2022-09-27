function formatDate() {
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
  let currentTime = new Date();
  let dayName = days[currentTime.getDay()];
  let hours = currentTime.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentTime.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let month = months[currentTime.getMonth()];
  let dayNumber = currentTime.getDate();
  return {
    date: `${month} ${dayNumber}`,
    dayName: dayName,
    time: `${hours}:${minutes}`,
  };
}
function displayCurrentDate() {
  let date = document.querySelector("#date");
  let dayAndTime = document.querySelector("#day-and-time");
  date.innerHTML = formatDate().date;
  dayAndTime.innerHTML = `${formatDate().dayName} ${formatDate().time}`;
}
function displayWeatherConditions(responce) {
  document.querySelector("#current-city").innerHTML = responce.data.name;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    responce.data.main.temp
  );
  document.querySelector("#celsius").classList.add("scale");
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
  )} m/s`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${responce.data.main.humidity} %`;
}
function searchCity(city) {
  let apiKey = "7d478f69e1b2f5d563653f13f5f91d76";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherConditions);
}
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-field").value;
  searchCity(city);
}
function createSearchEngine() {
  let searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("submit", handleSubmit);
}
function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "7d478f69e1b2f5d563653f13f5f91d76";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherConditions);
}
function searchCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
function activateCurrentLocationButton() {
  let currentLocationButton = document.querySelector(
    "#current-location-button"
  );
  currentLocationButton.addEventListener("click", searchCurrentPosition);
}
function putCityInInput(city) {
  city.addEventListener("click", function (event) {
    event.preventDefault();
    let inputCity = document.querySelector("#input-field");
    inputCity.value = event.target.innerHTML;
  });
}
function chooseFromPopularCities() {
  let popularCities = document.querySelectorAll(".city");
  popularCities.forEach(putCityInInput);
}

searchCity("Kyiv");
displayCurrentDate();
chooseFromPopularCities();
createSearchEngine();
activateCurrentLocationButton();
