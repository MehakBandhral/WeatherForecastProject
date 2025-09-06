const apiKey = "565ff0e0eaa35be5f462d559468b26dc"; // 🔑 Replace with your OpenWeather API key

async function getWeather() {
  const city = document.getElementById("city").value;
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  try {
    // 🌡 Today’s Weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      document.getElementById("weatherInfo").innerHTML = "City not found!";
      document.getElementById("forecast").innerHTML = "";
      return;
    }

    document.getElementById("weatherInfo").innerHTML = `
      <h4>${weatherData.name}, ${weatherData.sys.country}</h4>
      <p>🌡 Temp: ${weatherData.main.temp}°C</p>
      <p>💧 Humidity: ${weatherData.main.humidity}%</p>
      <p>☁️ ${weatherData.weather[0].description}</p>
    `;
    document.getElementById("icon").innerHTML =
      `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png">`;

    // 📅 5-Day Forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();

    // Group forecast by day (pick 12:00 pm data for each day)
    const dailyForecast = {};
    forecastData.list.forEach(entry => {
      if (entry.dt_txt.includes("12:00:00")) {
        const date = new Date(entry.dt_txt);
        dailyForecast[date.toDateString()] = entry;
      }
    });

    // Display forecast
    let forecastHTML = "";
    Object.keys(dailyForecast).slice(0, 5).forEach(date => {
      const dayData = dailyForecast[date];
      forecastHTML += `
        <div class="forecast-day">
          <p><b>${new Date(dayData.dt_txt).toLocaleDateString("en-US", { weekday: 'short' })}</b></p>
          <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png">
          <p>${Math.round(dayData.main.temp)}°C</p>
          <p>💧 ${dayData.main.humidity}%</p>
          <p>${dayData.weather[0].description}</p>
        </div>
      `;
    });

    document.getElementById("forecast").innerHTML = forecastHTML;

  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById("weatherInfo").innerHTML = "Error loading data.";
    document.getElementById("forecast").innerHTML = "";
  }
}
