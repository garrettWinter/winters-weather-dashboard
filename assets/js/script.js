console.log("Connected")
var searchBtn = document.querySelector('#searchBtn');
var currentLocation = document.querySelector('#currentLocation')
var currentTemp = document.querySelector('#currentTemp')
var currentWind = document.querySelector('#currentWind')
var currentHumidity = document.querySelector('#currentHumidity')
var tableContainer = document.getElementById('forecastBoxes');
var searchHistory = document.getElementById('searchHistory');
let forecastLoopArray = [];
let rawData = [];
let mainArray = []
var firstLoad = true;
var searchHistoryArray = [];

function startup(){

}

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

    //store to local storage
    searchHistoryArray.push(rawData.city.name);
    console.log(searchHistoryArray);
    localStorage.setItem("Search History", JSON.stringify(searchHistoryArray));
    displayUpdates();
};
function displayUpdates (){
    /* Clearing any previously made child elements */
    if (firstLoad === false) {
        for (let i = 0; i < 5; i++) {
            tableContainer.removeChild(tableContainer.children[0]);
    } 
    };
    /* Current Weather box being updated*/
    var currentIconStringImage = '<img src="https://openweathermap.org/img/w/'+mainArray[1].forecastLoopArray[4]+'.png"'+'alt="'+mainArray[1].forecastLoopArray[3]+'">'
    currentIconString = mainArray[0] + " (" + dayjs(mainArray[1].forecastLoopArray[0]).format('MM/DD/YY') +") "+currentIconStringImage;
    console.log(currentIconString)
    currentLocation.innerHTML = currentIconString;
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
    createForcastDate.textContent = dayjs(mainArray[i].forecastLoopArray[0]).format('MM/DD/YY');
    createDayDiv.appendChild(createForcastIcon);
    let iconString = '';
    iconString = '<img src="https://openweathermap.org/img/w/'+mainArray[i].forecastLoopArray[4]+'.png"'+'alt="'+mainArray[i].forecastLoopArray[3]+'">'
    createForcastIcon.innerHTML = iconString;
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

function searchHistoryFunction(event) {
    // check what event was clicked
    // need to have cityFeild.value populated from localstorage
    mainArray = [];
    /* Setting the URL and triggering the GET API */
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?appid=7f29a8f10e94d08a0485fced9d41201e&units=imperial&q=' + cityFeild.value;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            rawData = data;
            dataHandling();
        });
}

/* Event Listenters*/
searchBtn.addEventListener("click", citySearch);
searchHistory.addEventListener("click", searchHistoryFunction);

startup();

/* Pseduo Coding 

Get search button grab the text area feild and store it in the variable
perform the api call using that saved variable



Extras
    Error Handling for failed search
    Document.ready should be loaded
    modal overlay while page loads
    create button to clear all history
    create button to remove a single history
    link OpenWeather in footer
    Prevent Duplication of cities in search history
    hover over for search and search history buttoms


*/

