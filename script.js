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

        // clear any old content

        var city = data.name;
        console.log(city);
        console.log(data.main.temp);
        var tempF = ((data.main.temp-273.15) * (9/5) + 32).toFixed(0);
        console.log(tempF + "degrees")
        var windS = data.wind.speed;
        console.log(windS);

        // merge and add to page

        var currentCard = $("<div>").attr("class", "card");
        $("#forecast").append(currentCard);
        var currentCardBody = $("<div>").attr("class", "card");
        currentCard.append(currentCardBody)
        currentCardBody.append(city);
        currentCardBody.append(tempF);
        currentCardBody.append(windS); 
        
        // call follow-up api endpoints
        getForecast(searchValue);
        getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  
  function getForecast(searchValue) {
    $.ajax({
      type: "",
      url: "" + searchValue + "",
      dataType: "json",
      success: function(data) {
        // overwrite any existing content with title and empty row

        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            

            // merge together and put on page
          }
        }
      }
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      type: "",
      url: "" + lat + "&lon=" + lon,
      dataType: "json",
      success: function(data) {
        var uv = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);
        
        // change color depending on uv value
        
        $("#today .card-body").append(uv.append(btn));
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
