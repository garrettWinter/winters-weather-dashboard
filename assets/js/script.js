console.log("Connection Test")

var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=Menahga&appid=7f29a8f10e94d08a0485fced9d41201e&units=imperial';
// var requestUrl = 'https://api.github.com/repos/twitter/chill/issues?per_page=5';

fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('All Data \n----------');
    console.log(data);
    console.log('----------\n parsed data \n----------');
    console.log(data.list[0].dt_txt);
    console.log(data.list[0].main.temp);
    console.log(data.list[0].main.humidity);
    console.log(data.list[0].weather[0].main);
    console.log(data.list[0].weather[0].icon);
    console.log(data.list[0].wind.speed);
   });



/* Pseduo Coding 

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


*/

