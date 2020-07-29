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

        $(".current-card").remove();


        var city = data.name;
        console.log(city);
        var rightNow = moment().format('l');
        var hereAndNow = city + ":  " + rightNow;
        console.log(data.main.temp);
        var tempF = ((data.main.temp-273.15) * (9/5) + 32).toFixed(0);
        console.log(tempF + "degrees")
        var windS = data.wind.speed;
        console.log(windS);


        var currentCard = $("<div>").attr("class", "card");
        $("#forecast").append(currentCard);
        var currentCardBody = $("<div>").attr("class", "card-body current-card");
        currentCard.append(currentCardBody)
        currentCardBody.append(hereAndNow);

        currentCardBody.append(tempF);
        currentCardBody.append(windS); 
        
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
            
            var dt = new Date();
            console.log(dt);
            var dte = dt.getMonth() + " " + dt.getDate() + "th";
            console.log(dte);

            

            var hiTemp = ((data.list[i].main.temp_max - 273.15) * (9/5) + 32).toFixed(0);
            console.log("The high temperature for the above date is " + hiTemp);

            var humidity = data.list[i].main.humidity;
            console.log("The humidity for the above date is " + humidity + "%")
            console.log("we are on index number " + [i]);

            // merge together and put on page

            
            var forecastCard = $("<div>").attr("class", "card forecast-card");
            var forecastCardBody = $("<div>").attr("class", "card-body");
            $(".five-day").append(forecastCard);
            forecastCard.append(forecastCardBody);
            forecastCardBody.append(hiTemp);
            forecastCardBody.append(humidity);
            
          }
        }
      }
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/uvi?appid=c6d5f05decfd9be073dd9d9ddc0bd4c5&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      success: function(data) {
        var uv = $("<p>").text("UV Index: " + data.value);
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);
        console.log(uv.val());
        // change color depending on uv value
        
        $(".current-card").append(uv.append(btn));
        
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
