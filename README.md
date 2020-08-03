**Acceptance Criteria:**

GIVEN a weather dashboard with form inputs:

- WHEN I search for a city, I am presented with current and future conditions for that city and that city is added to the search history.
- WHEN I view current weather conditions for that city, I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
- WHEN I view the UV index, I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
- WHEN I view future weather conditions for that city, I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
- WHEN I click on a city in the search history, I am again presented with current and future conditions for that city
- WHEN I open the weather dashboard, I am presented with the last searched city forecast

__________________________________________________

Functioning site at https://jhf1203.github.io/Weather-App/
Demo GIF at "./assets/weather-app-demo.gif"

Starter code for this project was provided, and the functions contained within are really only driven by two different events, either the page itself loading/refreshing or the search button being clicked.  The same functions that retrieve current and upcoming weather conditions are set to run as an item from our history area is clicked as well.  

Quite a bit goes into obtaining our current conditions by city once the ajax call is made with the city name.  The conditional on line 28 tests whether or not the city was already in our local history (if it was it wouldn't have an index of -1) and if it isn't creates a new row in our history for easy access in the future to that city.  

Next, on line 34 we clear the values from the previous search result by elminating the divs altogether, with the understanding that new ones are created dynamically within the same function.  

The large portion of this function is dedicated to populating the current weather data for a given place, and that begins as we define our variables on line 40 and then build the elements directly afterwards.  

What we need to keep in mind for this card of current conditions is how the card visuals might change depending on what the current conditions actually are.  You'll see a rather lengthy conditional beginning on line 71 that accomplishes this.  This pulls the condition description ID from the JSON, and changes the theme of the current card as well as the history column to one of 12 different custom themes I created, complete with icons and a re-tooled description.  We're able to place the description as well as the current temperature side-by-side by creating the "overviewCurrent" div to show the current temperature, and for the text to vary based off of the conditions.  

Once the correct special class is chosen for the current card we append the UV index results (obtained separately) and call the second large function of this page, which is retrieving the forecast ("getForecast" on line 177). 

A large portion of the forecast info is derived the same was as our current conditions, except it is nested into a for loop on line 188 to ensure the data is retrieved five times.  The elements and conditions shown are close to the same, but there are a few key differences we worked out for the forecast:
- Using moment to ensure that the forecast date changes and stays accurate.  You'll see the "setDate" function on line 292 which accomplishes this.  I did a for each since we will have five forecast cards created dynamically in getForecast, and built a "daysOut" variable to increase by one and thereby change the math in the moment function each time it runs to add an additional day.  
- Getting a low temperature for the day as well as a high temperature.  This was not in the original scope, but for the traveler it's important to know what the overall temperature swing will be in a given day, as it can be quite drastic in certain areas of the country and can greatly influence what should be packed.  The logic was already there to use the 15:00 value to pull temperature and humidity.  We can assume that generally 3pm is the hottest part of the day, so we can also assume that 3am is the coolest part of most days.  Lines 191-208 generate a second temperature for 3am (which will always be index i +/- 4 if we assume 3pm is index i).  Then we test which of those temperatures is higher and which is lower, and assign them appropriately since meteorologically speaking if it's warmer at 3am than 3pm, then the high temperature would be the 3am one.  This could be expanded to pull a temperature value for each hourly forecast and then choose the overall high and overall low if we wanted the temperature data to be as accurate as possible, which is the directtion we would want to take were we building this app for a client.

The last function we see on this page is obtaining the UV index for the current weather conditions.  This works in tandem with the ajax call for current weather as it's based off of geographical coordinates (you'll notice the "lat" and "lon" variables from above used in this function).  Per our client's instructions we color-code the UV Index based off of it's severity, the values and classifications of which I pulled from the national weather service.  We display the value of the UV index inside of the button, and the conditional on line 314 helps us determine which color the button should be.  We append the result to our current-card-body built in the searchWeather function to get complete conditions in one place.

__________________________________________________

With meteorology being a hobby of mine I was highly engaged in this project, and am happy to know that during my time in this program I'm able to build a comprehensive current weather app from scratch.  

I did deviate slightly from the instructions in creating the icon that signifies the current conditions.  The icon was very small in size and we had a lot of room to work with, so I was able to custom-draw the icons that display under current conditions and assign them to a color palette that changes based off of current conditions.  You can find them housed in the assets folder along with the .xcf file that includes the base copy of each of these icons/themes, saved as a layer.  

- **Jim**






