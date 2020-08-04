$(document).ready(function() {
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val();
    searchWeather(searchValue);
    $("#search-value").val("");
    $("#search-value").attr("placeholder", "Search For a City");
  });

  // This function allows us to view the current conditions for any city in our local history.
  $(".history").on("click", "li", function() {
    searchWeather($(this).text());

  });

  // This function ensures that saved search locations are populated under the search bar
  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

  // Ajax call for current weather conditions
  function searchWeather(searchValue) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + 
            searchValue + "&appid=c6d5f05decfd9be073dd9d9ddc0bd4c5",
      dataType: "json",
      success: function(data) {

        // This adds the location to our history, provided it isn't already there.
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
          makeRow(searchValue);
        }

        // Here is where we clear the content loaded from the previous search.
        $(".current-card-header").remove();
        $(".current-card-body").remove();
        $(".card").remove();
        

        // Variables created from values pulled from the API
        var city = data.name;
        var rightNow = moment().format('dddd, MMMM Do');
        var tempF = ((data.main.temp-273.15) * (9/5) + 32).toFixed(0);
        var windS = data.wind.speed.toFixed(0);
        var windD = data.wind.deg;
        var humidCurrent = data.main.humidity;
        var heatIndex = ((data.main.feels_like-273.15) * (9/5) + 32).toFixed(0);
        var historyCol = $(".col-lg-3");
        var conditionsId = data.weather[0].id;

        // Conditional to display the correct wind direction
        if (22.5 < windD && windD < 67.5) {
          windDir = "NE"
        } else if (67.5 < windD && windD < 112.5) {
          windDir = "E"
        } else if (112.5 < windD && windD < 157.5) {
          windDir = "SE"
        } else if (157.5 < windD && windD < 202.5) {
          windDir = "S"
        } else if (202.5 < windD && windD < 247.5) {
          windDir = "SW"
        } else if (247.5 < windD && windD < 292.5) {
          windDir = "W"
        } else if (292.5 < windD && windD < 337.5) {
          windDir = "NW"
        } else {
          windDir = "N"
        }
        
        // Creating elements reflective of current weather data.
        var currentCard = $("<div>")
          .attr("class", "card");
        var currentCardHeader = $("<h2>")
          .attr("class", "card-header current-card-header")
          .html("Currently, in " + city + " | " + rightNow);
        var currentCardBody = $("<div>")
          .attr("class", "card-body current-card-body");
        var humidityCurrent = $("<p>")
          .attr("class", "current-p current-humidity")
          .html("Humidity | " + humidCurrent + "%");
        var windCurrent = $("<p>")
          .attr("class", "current-p current-wind")
          .html("Wind Speed | " + windS + "mph " + windDir);
        var feelsLike = $("<p>")
          .attr("class", "current-p todays-high")
          .html("Feels Like | " + heatIndex + "&deg");
        var overviewCurrent = $("<p>")
          .attr("class", "current-p current-overview");
        
        // This conditional attaches the correct icon/color palette to the page based off of current conditions: https://openweathermap.org/weather-conditions

        if (conditionsId === 800) {

          currentCardBody.addClass("clear-now");
          historyCol.removeClass("partly-cloudy-now mostly-cloudy-now cloudy-now showers-now thunderstorm-now rain-now snow-now wintry-mix-now sleet-now windy-now foggy-now")
          historyCol.addClass("clear-now");
          overviewCurrent.html(tempF + "&deg F | Clear");

        } else if ( 800 < conditionsId && conditionsId < 803) {

          currentCardBody.addClass("partly-cloudy-now");
          historyCol.removeClass("clear-now mostly-cloudy-now cloudy-now showers-now thunderstorm-now rain-now snow-now wintry-mix-now sleet-now windy-now foggy-now")
          historyCol.addClass("partly-cloudy-now");
          overviewCurrent.html(tempF + "&deg F | Partly Cloudy");

        } else if (conditionsId === 803) {

          currentCardBody.addClass("mostly-cloudy-now");
          historyCol.removeClass("clear-now partly-cloudy-now cloudy-now showers-now thunderstorm-now rain-now snow-now wintry-mix-now sleet-now windy-now foggy-now")
          historyCol.addClass("mostly-cloudy-now");
          overviewCurrent.html(tempF + "&deg F | Mostly Cloudy");

        } else if (conditionsId === 804) {

          currentCardBody.addClass("cloudy-now");
          historyCol.removeClass("clear-now partly-cloudy-now mostly-cloudy-now showers-now thunderstorm-now rain-now snow-now wintry-mix-now sleet-now windy-now foggy-now")
          historyCol.addClass("cloudy-now");
          overviewCurrent.html(tempF + "&deg F | Cloudy");

        } else if (299 < conditionsId && conditionsId < 399) {

          currentCardBody.addClass("showers-now");
          historyCol.removeClass("clear-now partly-cloudy-now mostly-cloudy-now cloudy-now thunderstorm-now rain-now snow-now wintry-mix-now sleet-now windy-now foggy-now")
          historyCol.addClass("showers-now");
          overviewCurrent.html(tempF + "&deg F | Showers");

        } else if ( 199 < conditionsId && conditionsId < 299) {

          currentCardBody.addClass("thunderstorm-now");
          historyCol.removeClass("clear-now partly-cloudy-now mostly-cloudy-now cloudy-now showers-now rain-now snow-now wintry-mix-now sleet-now windy-now foggy-now")
          historyCol.addClass("thunderstorm-now");
          overviewCurrent.html(tempF + "&deg F | Thunderstorm");

        } else if (499 < conditionsId && conditionsId < 599 && conditionsId != 511) {

          currentCardBody.addClass("rain-now");
          historyCol.removeClass("clear-now partly-cloudy-now mostly-cloudy-now cloudy-now showers-now thunderstorm-now  snow-now wintry-mix-now sleet-now windy-now foggy-now");
          historyCol.addClass("rain-now");
          overviewCurrent.html(tempF + "&deg F | Rain");

        } else if ((599 < conditionsId && conditionsId < 603) || (619 < conditionsId && conditionsId < 623)) {

          currentCardBody.addClass("snow-now");
          historyCol.removeClass("clear-now partly-cloudy-now mostly-cloudy-now cloudy-now showers-now rain-now thunderstorm-now wintry-mix-now sleet-now windy-now foggy-now");
          historyCol.addClass("snow-now");
          overviewCurrent.html(tempF + "&deg F | Snow");

        } else if ( 614 < conditionsId && conditionsId < 617 || conditionsId === 511) {

          currentCardBody.addClass("wintry-mix-now");
          historyCol.removeClass("clear-now partly-cloudy-now mostly-cloudy-now cloudy-now showers-now thunderstorm-now rain-now snow-now sleet-now windy-now foggy-now");
          historyCol.addClass("wintry-mix-now");
          overviewCurrent.html(tempF + "&deg F | Wintry Mix");

        } else if (610 < conditionsId && conditionsId < 614) {

          currentCardBody.addClass("sleet-now");
          historyCol.removeClass("clear-now partly-cloudy-now mostly-cloudy-now cloudy-now showers-now rain-now thunderstorm-now snow-now wintry-mix-now windy-now foggy-now");
          historyCol.addClass("sleet-now")
          overviewCurrent.html(tempF + "&deg F | Sleet");

        } else if (770 < conditionsId && conditionsId < 782) {

          currentCardBody.addClass("windy-now");
          historyCol.removeClass("clear-now partly-cloudy-now mostly-cloudy-now cloudy-now showers-now rain-now thunderstorm-now  snow-now wintry-mix-now sleet-now foggy-now");
          historyCol.addClass("windy-now");
          overviewCurrent.html(tempF + "&deg F | Windy");

        } else {

          currentCardBody.addClass("foggy-now");
          historyCol.removeClass("clear-now partly-cloudy-now mostly-cloudy-now cloudy-now showers-now rain-now thunderstorm-now  snow-now wintry-mix-now sleet-now windy-now");
          historyCol.addClass("foggy-now")
          overviewCurrent.html(tempF + "&deg F | Foggy");

        }

        // Here we add the content to our card containing our current weather conditions.
        $("#forecast").append(currentCard);
        currentCard.append(currentCardHeader);
        currentCard.append(currentCardBody);
        $(".current-card-body").append(overviewCurrent);
        $(".current-card-body").append(feelsLike);
        $(".current-card-body").append(humidityCurrent);
        $(".current-card-body").append(windCurrent);

        // Call function to obtain the 5-day forecast for the same city searched
        getForecast(searchValue);

        // Call function to obtain the UVI of the city searched.
        getUVIndex(data.coord.lat, data.coord.lon);
      } 
    })    
  }; 
  
  // ajax call for the forecast API
  function getForecast(searchValue) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=c6d5f05decfd9be073dd9d9ddc0bd4c5",
      dataType: "json",
      success: function(data) {

        // Clears the forecast for the previous location queried
        $(".forecast-card").remove();

        // Runs through each 3-hour increment (Usually indexes 0-39), displaying conditions forecast for 3pm on a given day, resulting in five forecasts found.
        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
           
            // This pulls the max temp forecasted at 3pm daily.
            var temp1 = ((data.list[i].main.temp_max - 273.15) * (9/5) + 32).toFixed(0);
            
            // Conditional to pull the minimum temperature value for 3am (usually will be the forecast low for the day)
            if (i > 5) {
              var temp2 = ((data.list[i-4].main.temp_min -273.5) * (9/5) + 32).toFixed(0);
            } else {             
              var temp2 = ((data.list[i+4].main.temp_min -273.5) * (9/5) + 32).toFixed(0)
            }

            // Conditional to ensure that the lowest temperature value between 3am and 3pm is the recorded low for the day, and vice versa, and sets them as our daily high temperature and daily low temperature.
            if (temp1 < temp2) {
              var hiTemp = temp2;
              var loTemp = temp1;
            } else {
              var hiTemp = temp1;
              var loTemp = temp2;
            }

            // More variables from the forecast API values 
            var forecastHumidity = data.list[i].main.humidity;
            var forecastId = data.list[i].weather[0].id;
            
            // Elements to be created for each five-day forecast card
            var forecastCard = $("<div>")
                              .attr("class", "card forecast-card");
            var forecastCardBody = $("<div>")
                              .attr("class", "card-body forecast-card-body");
            var forecastCardHeader = $("<h4>")
                              .attr("class", "card-header forecast-card-header");
            var forecastCardHi = $("<p>")
                              .attr("class", "forecast-card-p")
                              .html("High | " + hiTemp + "&deg");
            var forecastCardLo = $("<p>")
                              .attr("class", "forecast-card-p")
                              .html("Low | " + loTemp + "&deg");
            var forecastCardHumidity = $("<p>")
                              .attr("class", "forecast-card-p")
                              .html("Humidity | " + forecastHumidity + "%");
            var forecastCardConditions = $("<p>")
                              .attr("class", "forecast-card-p")
                              
            // This conditional attaches the correct icon/color palette to the page based off of future 3pm conditions: https://openweathermap.org/weather-conditions
            if (forecastId === 800) {
                forecastCardBody.addClass("clear-now");
                forecastCardConditions.html("Clear");
            } else if (forecastId > 800 && forecastId < 803) {
                forecastCardBody.addClass("partly-cloudy-now");
                forecastCardConditions.html("Partly Cloudy");
            } else if (forecastId === 803) {
              forecastCardBody.addClass("mostly-cloudy-now");
              forecastCardConditions.html("Mostly Cloudy");
            } else if (forecastId === 804) {
              forecastCardBody.addClass("cloudy-now");
              forecastCardConditions.html("Cloudy");
            } else if (forecastId > 299 && forecastId < 399) {
              forecastCardBody.addClass("showers-now");
              forecastCardConditions.html("Showers");
            } else if (199 < forecastId && forecastId < 299) {
              forecastCardBody.addClass("thunderstorm-now");
              forecastCardConditions.html("Thunderstorm");
            } else if (499 < forecastId && forecastId < 599 && forecastId != 511) {
              forecastCardBody.addClass("rain-now");
              forecastCardConditions.html("Rain");
            } else if ((599 < forecastId && forecastId < 603) || (619 < forecastId && forecastId < 623)) {
              forecastCardBody.addClass("snow-now");
              forecastCardConditions.html("Snow");
            } else if ((614 < forecastId && forecastId < 617) || forecastId === 511) {
              forecastCardBody.addClass("wintry-mix-now");
              forecastCardConditions.html("Wintry Mix");
            } else if (610 < forecastId && forecastId < 614) {
              forecastCardBody.addClass("sleet-now");
              forecastCardConditions.html("Sleet");
            } else if (770 < forecastId && forecastId < 790) {
              forecastCardBody.addClass("windy-now");
              forecastCardConditions.html("Windy");
            } else {
              forecastCardBody.addClass("foggy-now");
              forecastCardConditions.html("Foggy");

            }

            // Adding the created elements to the five-day forecast:  Five cards in total
            $(".five-day").append(forecastCard);
            forecastCard.append(forecastCardHeader)
            forecastCard.append(forecastCardBody);
            forecastCardBody.append(forecastCardHi);
            forecastCardBody.append(forecastCardLo);
            forecastCardBody.append(forecastCardHumidity);
            forecastCardBody.append(forecastCardConditions);

            // Attaching the correct future-date to each forecast card
            setDate();
            
          }
        }
      }
    });
  }

  // Function to add the correct dates to each card of the forecast.
  function setDate () {

    var daysOut = 1;
    $(".forecast-card-header").each(function() {
    $(this).text(moment().add(daysOut, 'days').format("ddd, MMM Do"));
    daysOut++
    });
  }

  // Ajax call to retrieve UV index
  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/uvi?appid=c6d5f05decfd9be073dd9d9ddc0bd4c5&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      success: function(data) {

        // Creating the two elements displaying the UV Index
        var uv = $("<p>").addClass("current-p").html("UV Index | ");
        var btn = $("<span>").addClass("btn btn-sm current-p");

        // conditional to color-code the button that indicates the UV Index Value
        if (data.value < 2.5) {
          btn.addClass("uv-low").html(data.value);
        } else if ( 2.4 < data.value && data.value < 5.5) {
          btn.addClass("uv-mod").html(data.value);
        } else if ( 5.4 < data.value && data.value < 7.5) {
          btn.addClass("uv-high").html(data.value);
        } else if (7.4 < data.value && data.value < 10.5) {
          btn.addClass("uv-very-high").html(data.value);
        } else {
          btn.addClass("uv-extreme").html(data.value);
        };

        // Adding the UV Index information to the current forecast
        $(".current-card-body").append(uv.append(btn));
        
      }
    });
  }

  // get current history, if any
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    searchWeather(history[history.length-1]);
  }

  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }
});
