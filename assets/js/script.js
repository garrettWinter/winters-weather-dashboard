
var searchBtn = document.querySelector('#searchBtn');
var currentLocation = document.querySelector('#currentLocation')
var currentTemp = document.querySelector('#currentTemp')
var currentWind = document.querySelector('#currentWind')
var currentHumidity = document.querySelector('#currentHumidity')
let forecastLoopArray = [];
let rawData = [];

let mainArray = []

function citySearch (event){
    mainArray = [];
    console.log("citySearch has been triggerd for city "+cityFeild.value)
    /* Validation to ensure a empty string is not submitted via the api call */
    if (cityFeild.value.length === 0) {
        window.alert("Invalid entry, Please enter a City before Searching.");
        return;
    }
    /* Setting the URL and triggering the GET API */
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?appid=7f29a8f10e94d08a0485fced9d41201e&units=imperial&q='+cityFeild.value;
    fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('----------\n API Response Data \n----------');
    console.log(data);
    rawData = data;
    dataHandling();
   });
};

function dataHandling (){
    /* Using a index (related to datalist) and count (trying to create the day0, day1 object name dynamicly) */
    for (let c = 0, i = 0 ; i <= 5; c=c+8, i++) {
        if (c === 40) {
            c = 39
        };
        forecastLoopArray = [];
        forecastLoopArray.push(rawData.list[c].dt_txt);
        forecastLoopArray.push(rawData.list[c].main.temp);
        forecastLoopArray.push(rawData.list[c].main.humidity);
        forecastLoopArray.push(rawData.list[c].weather[0].main);
        forecastLoopArray.push(rawData.list[c].weather[0].icon);
        forecastLoopArray.push(rawData.list[c].wind.speed);
        mainArray.push({forecastLoopArray});
    }
    mainArray.unshift(rawData.city.name);
    console.log('----------\n Final Data \n----------');
    console.log(mainArray);
    displayUpdates();
};
function displayUpdates (){
    currentLocation.textContent = mainArray[0] + " (" + mainArray[1].forecastLoopArray[0]+")";
    currentTemp.textContent = "Temp: " + mainArray[1].forecastLoopArray[1] + " ℉";
    currentWind.textContent = "Wind: " + mainArray[1].forecastLoopArray[5] + " mph";
    currentHumidity.textContent = "Humidity: " + mainArray[1].forecastLoopArray[2] + "%";


    /*Loop*/
for (let i = 1; i < 6; i++) {
    

    /* Element Creation */
    var createDayDiv = document.createElement('div');
    var createForcastDate = document.createElement('p');
    var createForcastIcon = document.createElement('p');
    var createForcastTemp = document.createElement('p');
    var createForcastWind = document.createElement('p');
    var createForcastHumidity = document.createElement('p');

    /* Element Updates */
    createDayDiv.classList.add("forecastDay");
    // createDayDiv.setAttribute("forcastDate", [0]); // NOT WORKING 
    createForcastDate.classList.add("date");
    createForcastIcon.classList.add("icon");
    createForcastTemp.classList.add("temp");
    createForcastWind.classList.add("wind");
    createForcastHumidity.classList.add("humidity");

    /* Element Appending */
    var tableContainer = document.getElementById('forecastBoxes');
    createDayDiv.appendChild(createForcastDate);
    /* Need to append data  */
    createDayDiv.appendChild(createForcastIcon);
    /* Need to append data  */
    createDayDiv.appendChild(createForcastTemp);
    /* Need to append data  */
    createForcastTemp.textContent = "Temp: " + mainArray[1].forecastLoopArray[1] + " ℉";
    createDayDiv.appendChild(createForcastWind);
    /* Need to append data  */
    createDayDiv.appendChild(createForcastHumidity);
     /* Need to append data  */
     tableContainer.appendChild(createDayDiv);
    };
/*
    <div date = "1" class="forecastDay">
    <p class = "date">Date 1</p>
    <p class = "icon">ICON</p>
    <p class = "temp">Temp: ???</p>
    <p class = "wind">Wind: ???</p>
    <p class = "humidity">Humidity: ???</p>

*/


}

/* Event Listenters*/
searchBtn.addEventListener("click", citySearch);

/* Pseduo Coding 

Get search button grab the text area feild and store it in the variable
perform the api call using that saved variable
for statment through data and create and data array


data array layout:
    City
    Day 0
        data.list[0].dt_txt
        data.list[0].main.temp
        data.list[0].main.humidity
        data.list[0].weather[0].main
        data.list[0].weather[0].icon
        data.list[0].wind.speed
    Day 1
        data.list[8].dt_txt
        data.list[8].main.temp
        data.list[8].main.humidity
        data.list[8].weather[0].main
        data.list[8].weather[0].icon
        data.list[8].wind.speed
    ......


Icons is the image name
  https://openweathermap.org/img/w/01n.png

5 day forcast Spots in Array
    Day 0 - 0
    Day 1 - 8
    Day 2 - 16
    Day 3 - 24
    Day 4 - 32
    Day 5-  40

Attributes

list:
    main:
        temp:
        humidity:
    weather:
        main:    
        icon:
    wind:
        speed:


Extras
    Document.ready should be loaded
    modal overlay while page loads
    create button to clear all history
    create button to remove a single history
    link OpenWeather in footer


*/

