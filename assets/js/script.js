/* Setting of global variables*/
var searchBtn = document.querySelector('#searchBtn');
var currentLocation = document.querySelector('#currentLocation')
var currentTemp = document.querySelector('#currentTemp')
var currentWind = document.querySelector('#currentWind')
var currentHumidity = document.querySelector('#currentHumidity')
var tableContainer = document.getElementById('forecastBoxes');
var searchHistory = document.getElementById('searchHistory');
var clearHistoryBTN = document.querySelector('#clearHistoryBTN')
var forecastText = document.querySelector("#forecastText")
var forecastLoopArray = [];
var rawData = [];
var mainArray = []
var firstLoad = true;
var searchHistoryArray;
var createHistoryli = '';
var createHistoryButton = '';
var setValue = '';
var responseReceived;

/* Checks local storage for any search history, and if present will load into memory and display on-screen. */
function startup() {
    console.log("Startup Ran");
    searchHistoryArray = JSON.parse(localStorage.getItem("Search History"));
    console.log(searchHistoryArray);
    if (searchHistoryArray === null) {
        console.log("History was NULL");
        return;
    } else {
        for (let i = 0; i < searchHistoryArray.length; i++) {
            createHistoryli = document.createElement('li');
            createHistoryButton = document.createElement('button');
            setValue = searchHistoryArray[i];
            createHistoryButton.setAttribute('search', setValue);
            createHistoryli.appendChild(createHistoryButton);
            searchHistory.appendChild(createHistoryli);
            createHistoryButton.textContent = setValue;
        }
    }
}

/* This is the function that makes the API call */
function citySearch(event) {
    responseReceived = '';
    mainArray = [];
    console.log("citySearch has been triggerd for city " + cityFeild.value)
    /* Validation to ensure a empty string is not submitted via the API call */
    if (cityFeild.value.length === 0) {
        window.alert("Invalid entry, Please enter a City before Searching.");
        return;
    }
    /* Setting the URL and triggering the GET API */
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?appid=7f29a8f10e94d08a0485fced9d41201e&units=imperial&q=' + cityFeild.value;
    fetch(requestUrl)
        .then(function (response) {
            responseReceived = response.status;
            if (responseReceived != 200) {
                console.log("Response Status Received:" + responseReceived);
                window.alert("An unexpected error has occurred, please check the spelling of your city.");
                return;
            }
            return response.json();
        })
        .then(function (data) {
            if (responseReceived != 200) {
                return;
            }
            console.log('----------\n API Response Data \n----------');
            console.log(data);
            rawData = data;
            dataHandling();
        });
}

/* This processes the 6 days of data returned and parses required data and stores this to local storage. */
function dataHandling() {
    /* Using a index (related to datalist) and count (trying to create the day0, day1 object name dynamically) */
    for (let c = 0, i = 0; i <= 5; c = c + 8, i++) {
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
        mainArray.push({ forecastLoopArray });
    }
    mainArray.unshift(rawData.city.name);
    console.log('----------\n Final Data \n----------');
    console.log(mainArray);

    //store to local storage
    console.log(searchHistoryArray);
    console.log(rawData.city.name);
    if (searchHistoryArray === null) {
        searchHistoryArray = [];
        // searchHistoryArray.push([rawData.city.name]);
    };
    searchHistoryArray.push([rawData.city.name]);
    console.log(searchHistoryArray);
    localStorage.setItem("Search History", JSON.stringify(searchHistoryArray));
    displayUpdates();
}
/* This function handles all on screen changes from the search */
function displayUpdates() {
    /* Clearing any previously made child elements */
    if (firstLoad === false) {
        for (let i = 0; i < 5; i++) {
            tableContainer.removeChild(tableContainer.children[0]);
        }
    };
    forecastText.textContent = '5 Day Forecast:';
    /* Updating Search History */
    createHistoryli = document.createElement('li');
    createHistoryButton = document.createElement('button');
    setValue = mainArray[0];
    createHistoryButton.setAttribute('search', setValue);
    createHistoryli.appendChild(createHistoryButton);
    searchHistory.appendChild(createHistoryli);
    createHistoryButton.textContent = setValue;

    /* Current Weather box being updated*/
    var currentIconStringImage = '<img src="https://openweathermap.org/img/w/' + mainArray[1].forecastLoopArray[4] + '.png"' + 'alt="' + mainArray[1].forecastLoopArray[3] + '">'
    currentIconString = mainArray[0] + " (" + dayjs(mainArray[1].forecastLoopArray[0]).format('MM/DD/YY') + ") " + currentIconStringImage;
    currentLocation.innerHTML = currentIconString;
    currentTemp.textContent = "Temp: " + mainArray[1].forecastLoopArray[1] + " ℉";
    currentWind.textContent = "Wind: " + mainArray[1].forecastLoopArray[5] + " mph";
    currentHumidity.textContent = "Humidity: " + mainArray[1].forecastLoopArray[2] + "%";

    /*Loop to create the 5 day forecast cards*/
    for (let i = 2; i <= 6; i++) {
        /* Element Creation */
        var createDayDiv = document.createElement('div');
        var createForcastDate = document.createElement('p');
        var createForcastIcon = document.createElement('p');
        var createForcastTemp = document.createElement('p');
        var createForcastWind = document.createElement('p');
        var createForcastHumidity = document.createElement('p');

        /* Element Updates */
        TableContainer = document.getElementById('forecastBoxes'); createDayDiv.appendChild(createForcastDate);
        createDayDiv.classList.add("forecastDay");
        // createDayDiv.setAttribute("forcastDate", [0]); // NOT WORKING --- ONLY NEEDED if doing clear specific history items
        createForcastDate.classList.add("date");
        createForcastIcon.classList.add("icon");
        createForcastTemp.classList.add("temp");
        createForcastWind.classList.add("wind");
        createForcastHumidity.classList.add("humidity");

        /* Element Appending */
        createForcastDate.textContent = dayjs(mainArray[i].forecastLoopArray[0]).format('MM/DD/YY');
        createDayDiv.appendChild(createForcastIcon);
        var iconString = '';
        iconString = '<img src="https://openweathermap.org/img/w/' + mainArray[i].forecastLoopArray[4] + '.png"' + 'alt="' + mainArray[i].forecastLoopArray[3] + '">'
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
/* This function allows the user to quickly search previous cities again */
function searchHistoryFunction(event) {
    var clicked = event.target.textContent;
    cityFeild.value = clicked;
    console.log(clicked);
    mainArray = [];
    /* Setting the URL and triggering the GET API */
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?appid=7f29a8f10e94d08a0485fced9d41201e&units=imperial&q=' + clicked;
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
/* This allows the user to clear there local storage via the UI */
function clearHistory(event) {
    console.log("Clear History has been triggered")
    for (let i = 0; i < searchHistoryArray.length; i++) {
        searchHistory.removeChild(searchHistory.children[0]);
    }
    searchHistoryArray = [];
    localStorage.setItem("Search History", JSON.stringify(searchHistoryArray));
}

/* Event Listenters*/
searchBtn.addEventListener("click", citySearch);
searchHistory.addEventListener("click", searchHistoryFunction);
clearHistoryBTN.addEventListener("click", clearHistory);

startup();

