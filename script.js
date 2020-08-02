$(document).ready(function() {
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val();

    // clear input box

    // searchValue.text("");

    searchWeather(searchValue);
  });

  $(".history").on("click", "li", function() {
    searchWeather($(this).text());
  });

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

  function searchWeather(searchValue) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + 
            searchValue + "&appid=c6d5f05decfd9be073dd9d9ddc0bd4c5",
      dataType: "json",
      success: function(data) {
        // create history link for this search
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
    
          makeRow(searchValue);
        }

        $(".current-card-header").remove();
        $(".current-card-body").remove();


        var city = data.name;
        // console.log(city);
        var rightNow = moment().format('dddd, MMMM Do');
        // console.log(data.main.temp);
        var tempF = ((data.main.temp-273.15) * (9/5) + 32).toFixed(0);
        // console.log(tempF + "degrees")
        var windS = data.wind.speed;
        // console.log(windS);
        var humidCurrent = data.main.humidity;
        var heatIndex = ((data.main.feels_like-273.15) * (9/5) + 32).toFixed(0)
        var currentConditions = data.weather[0].description;
        // console.log(currentConditions);

        var currentCard = $("<div>").attr("class", "card");
        $("#forecast").append(currentCard);

        var currentCardHeader = $("<h2>").attr("class", "card-header current-card-header").html("Currently, in " + city + " | " + rightNow);

        var currentCardBody = $("<div>").attr("class", "card-body current-card-body");


        var humidityCurrent = $("<p>").attr("class", "current-p current-humidity").html("Humidity | " + humidCurrent + "%");

        var windCurrent = $("<p>").attr("class", "current-p current-wind").html("Wind Speed | " + windS + "mph");

        var feelsLike = $("<p>").attr("class", "current-p todays-high").html("Feels Like | " + heatIndex + "&deg");
        var overviewCurrent = $("<p>").attr("class", "current-p current-overview");

        var historyCol = $(".col-lg-3");

        console.log("THIS IS HISTORYCOL " + historyCol);
        // console.log("This is the conditionscurrent variable: " + conditionsCurrent);
        

        if (data.weather[0].id == 800) {

          currentCardBody.addClass("clear-now");
          historyCol.addClass("clear-now");
          overviewCurrent.html(tempF + "&deg F | Clear");

        } else if (data.weather[0].id == 801, 802) {

          currentCardBody.addClass("partly-cloudy-now");
          historyCol.addClass("partly-cloudy-now");
          overviewCurrent.html(tempF + "&deg F | Partly Cloudy");

        } else if (data.weather[0].id == 803) {

          currentCardBody.addClass("mostly-cloudy-now");
          historyCol.addClass("mostly-cloudy-now");
          overviewCurrent.html(tempF + "&deg F | Mostly Cloudy");

        } else if (data.weather[0].id == 804) {

          currentCardBody.addClass("cloudy-now");
          historyCol.addClass("cloudy-now");
          overviewCurrent.html(tempF + "&deg F | Cloudy");

        } else if (data.weather[0].id == 300, 301, 310, 311, 313, 321, 500, 501, 520, 521, 531) {

          currentCardBody.addClass("showers-now");
          historyCol.addClass("showers-now");
          overviewCurrent.html(tempF + "&deg F | Showers");

        } else if (data.weather[0].id == 200, 201, 202, 210, 211, 212, 221, 230, 231, 232) {

          currentCardBody.addClass("thunderstorm-now");
          historyCol.addClass("clear-now");
          overviewCurrent.html(tempF + "&deg F | Thunderstorm");

        } else if (data.weather[0].id == 502, 503, 504, 522, 302, 312, 314) {

          currentCardBody.addClass("rain-now");
          historyCol.addClass("rain-now");
          overviewCurrent.html(tempF + "&deg F | Rain");

        } else if (data.weather[0].id == 600, 601, 602, 620, 621, 622) {

          currentCardBody.addClass("snow-now");
          historyCol.addClass("snow-now");
          overviewCurrent.html(tempF + "&deg F | Snow");

        } else if (data.weather[0].id == 511, 615, 616) {

          currentCardBody.addClass("wintry-mix-now");
          historyCol.addClass("wintry-mix-now");
          overviewCurrent.html(tempF + "&deg F | Wintry Mix");

        } else if (data.weather[0].id == 611, 612, 613) {

          currentCardBody.addClass("sleet-now");
          historyCol.addClass("sleet-now")
          overviewCurrent.html(tempF + "&deg F | Sleet");

        } else if (data.weather[0].id == 771, 781) {

          currentCardBody.addClass("windy-now");
          historyCol.addClass("windy-now");
          overviewCurrent.html(tempF + "&deg F | Windy");

        } else {

          currentCardBody.addClass("foggy-now");
          historyCol.addClass("foggy-now")
          overviewCurrent.html(tempF + "&deg F | Foggy");

        }

        currentCard.append(currentCardHeader);
        currentCard.append(currentCardBody);
        $(".current-card-body").append(overviewCurrent);
        // $(".current-card-body").append(conditionsCurrent);
        $(".current-card-body").append(feelsLike);
        $(".current-card-body").append(humidityCurrent);
        $(".current-card-body").append(windCurrent);


        
        
        // call follow-up api endpoints
        getForecast(searchValue);
        getUVIndex(data.coord.lat, data.coord.lon);
      } 
    })    
  }; 
  
  function getForecast(searchValue) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=c6d5f05decfd9be073dd9d9ddc0bd4c5",
      dataType: "json",
      success: function(data) {

        $(".forecast-card").remove();

         // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            // console.log("we are on index " + i);
            var hiTemp = ((data.list[i].main.temp_max - 273.15) * (9/5) + 32).toFixed(0);
            
            if (i > 5) {

              var loTemp = ((data.list[i-4].main.temp_min -273.5) * (9/5) + 32).toFixed(0);

            } else {
              
              var loTemp = ((data.list[i+4].main.temp_min -273.5) * (9/5) + 32).toFixed(0)
            }

            var forecastHumidity = data.list[i].main.humidity;

            var forecastConditions = data.list[i].weather[0].description;
            // console.log(forecastConditions);
            console.log("we are on index number " + [i]);

            // merge together and put on page

            
            var forecastCard = $("<div>")
                              .attr("class", "card forecast-card");
            var forecastCardBody = $("<div>")
                              .attr("class", "card-body forecast-card-body");
            $(".five-day").append(forecastCard);
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
                              

            if (data.list[i].weather[0].id == 800) {

                forecastCardBody.addClass("clear-now");
                forecastCardConditions.html("Clear");

            } else if (data.list[i].weather[0].id == 801, 802) {

                forecastCardBody.addClass("partly-cloudy-now");
                forecastCardConditions.html("Partly Cloudy");

            } else if (data.list[i].weather[0].id == 803) {

              forecastCardBody.addClass("mostly-cloudy-now");
              forecastCardConditions.html("Mostly Cloudy");

            } else if (data.list[i].weather[0].id == 804) {

              forecastCardBody.addClass("cloudy-now");
              forecastCardConditions.html("Cloudy");

            } else if (data.list[i].weather[0].id == 300, 301, 310, 311, 313, 321, 500, 501, 520, 521, 531) {

              forecastCardBody.addClass("showers-now");
              forecastCardConditions.html("Showers");

            } else if (data.list[i].weather[0].id == 200, 201, 202, 210, 211, 212, 221, 230, 231, 232) {

              forecastCardBody.addClass("thunderstorm-now");
              forecastCardConditions.html("Thunderstorm");

            } else if (data.list[i].weather[0].id == 502, 503, 504, 522, 302, 312, 314) {

              forecastCardBody.addClass("rain-now");
              forecastCardConditions.html("Rain");

            } else if (data.list[i].weather[0].id == 600, 601, 602, 620, 621, 622) {

              forecastCardBody.addClass("snow-now");
              forecastCardConditions.html("Snow");

            } else if (data.list[i].weather[0].id == 511, 615, 616) {

              forecastCardBody.addClass("wintry-mix-now");
              forecastCardConditions.html("Wintry Mix");

            } else if (data.list[i].weather[0].id == 611, 612, 613) {

              forecastCardBody.addClass("sleet-now");
              forecastCardConditions.html("Sleet");

            } else if (data.list[i].weather[0].id == 771, 781) {

              forecastCardBody.addClass("windy-now");
              forecastCardConditions.html("Windy");

            } else {

              forecastCardBody.addClass("foggy-now");
              forecastCardConditions.html("Foggy");

            }



            forecastCard.append(forecastCardHeader)
            forecastCard.append(forecastCardBody);
            forecastCardBody.append(forecastCardHi);
            forecastCardBody.append(forecastCardLo);
            forecastCardBody.append(forecastCardHumidity);
            forecastCardBody.append(forecastCardConditions);

            setDate();
            
          }
        }
      }
    });
  }

  function setDate () {

    var daysOut = 1;

    $(".forecast-card-header").each(function() {
      console.log("this is daysout right now" + daysOut);
    $(this).text(moment().add(daysOut, 'days').format("ddd, MMM Do"));

    daysOut++
      console.log("This is after we added a day to daysout" + daysOut);
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/uvi?appid=c6d5f05decfd9be073dd9d9ddc0bd4c5&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      success: function(data) {
        var uv = $("<p>").addClass("current-p").html("UV Index | ");
        var btn = $("<span>").addClass("btn btn-sm current-p");

        console.log("Here is our button" + data.value);
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
