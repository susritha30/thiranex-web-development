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

    // Validate input
    if (city === "") {
        message.textContent = "Please enter a city name.";
        weatherResult.hidden = true;
        return;
    }

    // Show loading message
    message.textContent = "Loading weather data...";
    weatherResult.hidden = true;

    try {
        // Step 1: Search for the city
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const geoData = await geoResponse.json();

        // Check if city exists
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(
                "City not found. Please enter a valid city name."
            );
        }

        const location = geoData.results[0];

        // Check location data
        if (
            typeof location.latitude !== "number" ||
            typeof location.longitude !== "number"
        ) {
            throw new Error("Invalid location data received.");
        }

        // Step 2: Fetch current weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error(
                "Unable to fetch weather data. Please try again."
            );
        }

        const weatherData = await weatherResponse.json();

        // Check weather data
        if (!weatherData.current || !weatherData.current_units) {
            throw new Error("Weather data is unavailable.");
        }

        // Step 3: Display city
        cityName.textContent = `${location.name}, ${location.country || ""}`;

        // Step 4: Display temperature
        temperature.textContent =
            `${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}`;

        // Step 5: Display humidity
        humidity.textContent =
            `${weatherData.current.relative_humidity_2m} ${weatherData.current_units.relative_humidity_2m}`;

        // Step 6: Display wind speed
        windSpeed.textContent =
            `${weatherData.current.wind_speed_10m} ${weatherData.current_units.wind_speed_10m}`;

        // Show result
        weatherResult.hidden = false;
        message.textContent = "Weather data updated successfully.";

    } catch (error) {
        console.error("Weather error:", error);

        weatherResult.hidden = true;
        message.textContent =
            error.message ||
            "Something went wrong. Please try again.";
    }
});
