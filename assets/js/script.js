console.log("Connected")
var searchBtn = document.querySelector('#searchBtn');
var currentLocation = document.querySelector('#currentLocation')
var currentTemp = document.querySelector('#currentTemp')
var currentWind = document.querySelector('#currentWind')
var currentHumidity = document.querySelector('#currentHumidity')
var tableContainer = document.getElementById('forecastBoxes');
var forecastDayContainer = document.querySelector('.forecastDay');
let forecastLoopArray = [];
let rawData = [];
let mainArray = []
var firstLoad = true;

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
    /* Clearing any previously made child elements */
    // tableContainer.removeChild(tableContainer.firstElementChild);
    if (firstLoad === false){
         forecastDayContainer.removeChild(forecastDayContainer.children[0]);
         forecastDayContainer.removeChild(forecastDayContainer.children[0]);
         forecastDayContainer.removeChild(forecastDayContainer.children[0]);
         forecastDayContainer.removeChild(forecastDayContainer.children[0]);
         tableContainer.removeChild(tableContainer.children[0]);
    };
    /* Current Weather box being updated*/
    currentLocation.textContent = mainArray[0] + " (" + dayjs(mainArray[1].forecastLoopArray[0]).format('MM/DD/YY') +")";
    currentTemp.textContent = "Temp: " + mainArray[1].forecastLoopArray[1] + " ℉";
    currentWind.textContent = "Wind: " + mainArray[1].forecastLoopArray[5] + " mph";
    currentHumidity.textContent = "Humidity: " + mainArray[1].forecastLoopArray[2] + "%";


    /*Loop*/
for (let i = 2; i <= 6; i++) {
    

    /* Element Creation */
    var createDayDiv = document.createElement('div');
    var createForcastDate = document.createElement('p');
    var createForcastIcon = document.createElement('p');
    var createForcastTemp = document.createElement('p');
    var createForcastWind = document.createElement('p');
    var createForcastHumidity = document.createElement('p');

    /* Element Updates */
    TableContainer = document.getElementById('forecastBoxes');createDayDiv.appendChild(createForcastDate);
    createDayDiv.classList.add("forecastDay");
    // createDayDiv.setAttribute("forcastDate", [0]); // NOT WORKING 
    createForcastDate.classList.add("date");
    createForcastIcon.classList.add("icon");
    createForcastTemp.classList.add("temp"); 
    createForcastWind.classList.add("wind");
    createForcastHumidity.classList.add("humidity");

    /* Element Appending */
    createForcastDate.textContent = "Date: " + dayjs(mainArray[i].forecastLoopArray[0]).format('MM/DD/YY');
    createDayDiv.appendChild(createForcastIcon);
    /* Need to append data  */
    createDayDiv.appendChild(createForcastTemp);
    createForcastTemp.textContent = "Temp: " + mainArray[i].forecastLoopArray[1] + " ℉";
    createDayDiv.appendChild(createForcastWind);
    createForcastWind.textContent = "Wind: " + mainArray[i].forecastLoopArray[5] + " mph";
    createDayDiv.appendChild(createForcastHumidity);
    createForcastHumidity.textContent = "Humidity: " + mainArray[i].forecastLoopArray[2] + "%";
    tableContainer.appendChild(createDayDiv);
    };
    firstLoad = false;
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

