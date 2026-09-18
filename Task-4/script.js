const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");

const weatherResult = document.getElementById("weather-result");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

weatherForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        weatherResult.hidden = true;
        return;
    }

    message.textContent = "Loading weather data...";
    weatherResult.hidden = true;

    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to the weather service.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city name.");
        }

        const location = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        cityName.textContent = `${location.name}, ${location.country}`;

        temperature.textContent =
            `${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}`;

        humidity.textContent =
            `${weatherData.current.relative_humidity_2m} ${weatherData.current_units.relative_humidity_2m}`;

        windSpeed.textContent =
            `${weatherData.current.wind_speed_10m} ${weatherData.current_units.wind_speed_10m}`;

        message.textContent = "Weather data updated successfully.";
        weatherResult.hidden = false;

    } catch (error) {
        message.textContent = error.message;
        weatherResult.hidden = true;
    }
});
