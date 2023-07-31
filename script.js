document.addEventListener("DOMContentLoaded", function () {
  function formatDate(timestamp) {
    let date = new Date(timestamp * 1000);
    let hours = date.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let day = days[date.getDay()];
    return `${day} ${hours}:${minutes}`;
  }

  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
  }

  function displayForecast(response) {
    let forecast = response.data.daily;

    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class="row">`;
    forecast.forEach(function (forecastDay, index) {
      if (index < 6) {
        forecastHTML =
          forecastHTML +
          `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
        <img
          src="${forecastDay.condition.icon_url}"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            (forecastDay.temperature.maximum * 9) / 5 + 32
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            (forecastDay.temperature.minimum * 9) / 5 + 32
          )}° </span>
        </div>
      </div>
  `;
      }
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
  }
  function getForecast(coordinates) {
    let apiKey = "c45f0a4aefb72ac935cfb59c3oe1ca4t";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
  }
  function displayTemperature(response) {
    console.log(response.data);
    let temperatureElement = document.querySelector("#temperature");
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");
    let dateElement = document.querySelector("#date");
    let iconElement = document.querySelector("#icon");

    let celsiusTemperature = response.data.temperature.current;
    let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;

    temperatureElement.innerHTML = Math.round(fahrenheitTemperature) + "°";
    cityElement.innerHTML = response.data.city;
    console.log(response.data.country);
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML =
      "Humidity:" + " " + response.data.temperature.humidity + "%";
    windElement.innerHTML =
      "Wind:" + " " + Math.round(response.data.wind.speed) + " " + "km/h";
    dateElement.innerHTML = formatDate(response.data.time);
    getForecast(response.data.coordinates);

    let iconUrl = response.data.condition.icon_url;
    iconUrl = iconUrl.replace("http://", "https://");

    iconElement.setAttribute("src", iconUrl);
    iconElement.setAttribute("alt", response.data.condition.description);
    iconElement.setAttribute("width", "60");
    getForecast(response.data.coordinates);
  }

  function search(city) {
    let apiKey = "c45f0a4aefb72ac935cfb59c3oe1ca4t";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?&query=${city}&key=${apiKey}&units=metric`;

    axios.get(apiUrl).then(displayTemperature);
    console.log("search function called with city: " + city);
  }
  function handleSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#getCity");
    search(cityInputElement.value);
  }

  function handlePosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let apiKey = "c45f0a4aefb72ac935cfb59c3oe1ca4t";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;

    axios.get(apiUrl).then(displayTemperature);
  }

  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(handlePosition);
  }

  let form = document.querySelector("#search-form");
  form.addEventListener("submit", handleSubmit);

  getCurrentLocation();
});
