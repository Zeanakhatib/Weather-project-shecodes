function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

function handleUnitClick(event) {
  event.preventDefault(event);
  let unit = event.target;
  let temperature = document.getElementById("temp").innerText;
  let unitText = unit.innerText;

  if (unitText === "C|F") {
    let fahrenheit = (parseFloat(temperature) * 9) / 5 + 32;
    document.getElementById("temp").innerText = `${Math.round(fahrenheit)}°`;
    unit.innerText = "F";
  } else if (unitText === "F") {
    let celsius = ((parseFloat(temperature) - 32) * 5) / 9;
    document.getElementById("temp").innerText = `${Math.round(celsius)}°`;
    unit.innerText = "C";
  }
}

let apiKey = "8c48afa47a9a9c24f3500c7039d50aaa";

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let cityDisplay = document.querySelector("h1");
  let city = response.data.name;
  cityDisplay.innerHTML = `${city}.value`;
  let citytemp = document.querySelector("h2");
  citytemp.innerHTML = `${temperature}°`;
}

function searchcity(event) {
  event.preventDefault();
  let city = document.getElementById("getCity").value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function showExactLocation(response) {
  let temperature = Math.round(response.data.main.temp);
  let exactGioTemp = document.querySelector("h2");
  exactGioTemp.innerHTML = `${temperature}°`;
  let cityDisplay = document.querySelector("h1");
  let city = response.data.name;
  cityDisplay.innerHTML = `${city}.value`;
}

function getCurrentLocation() {
  function success(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrlGio = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrlGio).then(showExactLocation);
  }
  navigator.geolocation.getCurrentPosition(success);
}

let currentlocation = document.querySelector("#currentLocation");
currentlocation.addEventListener("click", getCurrentLocation);

let link = document.querySelector("#unit");
link.addEventListener("click", handleUnitClick);

let form = document.querySelector("form");
form.addEventListener("submit", searchcity);
