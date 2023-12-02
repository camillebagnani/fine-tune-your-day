var apiKEY = 'f9318e6e5f17d9852d6500f0c55afb61'
var searchInput = document.querySelector('.search-input')
var searchBtn = document.querySelector('.search-btn')
function getApi() {
    var city = searchInput.val();
    var requestURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKEY;
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            document.querySelector('.main-weather').empty();
            var dateUnix = data.dt; // change from unix
            var date = new Date(dateUnix * 1000).toLocaleDateString()
            var tempKelvin = data.main.temp; // The API default temperature unit is Kelvin
            var tempFahrenheit = ((tempKelvin - 273.15) * 1.8 + 32).toFixed(2) // Convert Kelvin temp to Fahrenheit
            var wind = data.wind.speed; // The API default wind speed unit is meters/sec
            var windMPH = (wind * 2.2369).toFixed(2) // Convert meters/sec to miles/hour
            var humidity = data.main.humidity
            var iconCode = data.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            // $('.search-history').append("<ul><ul>").addClass("ul")
            // $('.search-history').append('<li>' + city + '</li>').addClass("li")
            document.querySelector('.main-weather').append(`<h3>${data.name + ' ' + '(' + date + ')'}<img src="${iconURL}"></h3>`).addClass('main-weather-header');
            document.querySelector('.main-weather').append(`<p> Temp: ${tempFahrenheit}°F</p>`).addClass('weatherData');
            document.querySelector('.main-weather').append(`<p> Wind: ${windMPH} MPH</p>`).addClass('weatherData');
            document.querySelector('.main-weather').append(`<p> Humidity: ${humidity}%</p>`).addClass('weatherData');
        })
}
searchBtn.addEventListener('click', function (event) {
    getApi()
})

searchInput.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        getApi()
    }
})

// i hate git