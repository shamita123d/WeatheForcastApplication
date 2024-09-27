"use strict";

const API_KEY = "f791956954d03c50f163ad8953f36fe4"; 

const cityInput = document.getElementById("cityInput");
const btnSearch = document.getElementById("btnSearch");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const btnTryNow = document.getElementById("btnTryNow");
const layer = document.getElementById("layer");
const btnDay = document.getElementById('btnDay');
const btnHours = document.getElementById('btnHours');
const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const fbtn = document.getElementById("fbtn");

const forecastinfo = document.getElementById("forecast-info"); 

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

// Display current day
const today = new Date();
const dayName = days[today.getDay()];
dayEl.textContent = dayName;

// Display current date
let month = today.toLocaleString("default", { month: "long" });
let date = today.getDate();
let year = today.getFullYear();
dateEl.textContent = `${date} ${month} ${year}`;

btnSearch.addEventListener("click", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city !== "") {
        getWeather(city);
        cityInput.value = "";
    } else {
        alert("Please enter a city name.");
    }
});

btnDay.addEventListener("click", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getDailyForecast(city);
    } else {
        alert("Unable to load...");
    }
});

btnHours.addEventListener("click", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getHourlyForecast(city);
    } else {
        alert("Unable to load...");
    }
});

async function getWeather(city) {
    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(API_URL);
        const data = await response.json();

        if (response.ok) {
            displayWeatherData(data);
            // Save to backend
            await saveWeatherData(data);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Something went wrong. Please try again.");
    }
}

async function saveWeatherData(data) {
    try {
        const weather = {
            cityName: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };

        const response = await fetch('/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(weather)
        });

        if (!response.ok) {
            throw new Error('Failed to save weather data');
        }
    } catch (error) {
        console.error("Error saving weather data:", error);
    }
}

async function getDailyForecast(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            const dailyData = data.list.filter((_, index) => index % 8 === 0); 
            let forecastHTML = '<h3>7-Day Forecast</h3>';
            dailyData.forEach(day => {
                const date = new Date(day.dt * 1000).toLocaleDateString();
                forecastHTML += `<p>${date} - Temp: ${Math.round(day.main.temp)}°C, ${day.weather[0].description}</p>`;
            });
            document.getElementById('forecast-info').innerHTML = forecastHTML;
        } else {
            alert("Unable to fetch forecast data");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Something went wrong. Please try again.");
    }
}

async function getHourlyForecast(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            let forecastHTML = '<h3>24-Hour Forecast</h3>';
            data.list.slice(0, 8).forEach(hour => {
                const time = new Date(hour.dt * 1000).toLocaleTimeString();
                forecastHTML += `<p>${time} - Temp: ${Math.round(hour.main.temp)}°C, ${hour.weather[0].description}</p>`;
            });
            document.getElementById('forecast-info').innerHTML = forecastHTML;
        } else {
            alert("Unable to fetch forecast data");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Something went wrong. Please try again.");
    }
}

function displayWeatherData(data) {
    cityNameEl.textContent = data.name;
    tempEl.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
    descEl.textContent = `Description: ${data.weather[0].description}`;
    humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
    windEl.textContent = `Wind Speed: ${data.wind.speed} km/h`;
    changeBackground(data.weather[0].description.toLowerCase());
}

function changeBackground(description) {
    if (description.includes("clear")) {
        layer.style.backgroundImage = "url(https://images.unsplash.com/photo-1459213599465-03ab6a4d5931?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
    } else if (description.includes("cloud")) {
        layer.style.backgroundImage = "url(https://images.unsplash.com/photo-1501612272219-9f77e47daef5?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
    } else if (description.includes("rain")) {
        layer.style.backgroundImage = "url(https://images.unsplash.com/photo-1527193874670-bf698eaa3d47?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
    } else if (description.includes("snow")) {
        layer.style.backgroundImage = "url(https://images.unsplash.com/photo-1482784160316-6eb046863ece?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
    } else {
        layer.style.backgroundImage = "url(https://images.unsplash.com/photo-1543958861-9c555a270d93?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
    }

    // Make sure the background covers the entire area
    layer.style.backgroundSize = "cover";
    layer.style.backgroundPosition = "center";
}

btnDay.addEventListener("click", () => {
    forecastinfo.classList.toggle("hidden"); 
});

btnHours.addEventListener("click", () => {
    forecastinfo.classList.toggle("hidden"); 
});
