(function(){

    // creates a dom element with the attributes specified
    // on the attributes object and the given innerHTML
    var createElem = function(type, attributes, innerHTML){
        var elem = document.createElement(type);
        for(var key in attributes){
            elem.setAttribute(key, attributes[key]);
        }
        elem.innerHTML = innerHTML || null;
        return elem;
    };

    var ajax = function(url, method, success, error){
        var r = new XMLHttpRequest();
        r.open(method, url, true);

        r.onload = function(){
            if(this.status >= 200 && this.status < 400){
                success(this); // success!
            }else{
                error(this);// reached server but error
            }
        };

        r.onerror = function(){
            error(this);// connection error of some sort
        };

        r.send();
    };

    var Current = function(attrs){
        this.attrs = attrs;

        this.render = function(){
            var current = createElem('div', {class: 'current'});
            var img = createElem('img', {class: 'current-img', src: this.attrs.img, alt: 'icon'});
            var weather = createElem('div', {class: 'weather'});
            weather.appendChild(createElem('span', {}, this.attrs.temp + '&deg'));
            weather.appendChild(createElem('span', {}, this.attrs.desc));
            current.appendChild(img);
            current.appendChild(weather);
            return current;
        };
    };

    var Period = function(attrs){
        this.attrs = attrs;

        this.render = function(){
            var period = createElem('div', {class: 'period'});

            period.appendChild( createElem('span', {class: 'time'}, this.attrs.time) );
            period.appendChild( createElem('img', {src: this.attrs.img, alt: 'icon'}) );
            period.appendChild( createElem('span', {class: 'temp'}, this.attrs.temp + '&deg') );
            period.appendChild( createElem('span', {class: 'precip'}, this.attrs.precip + 'mm') );

            return period;
        };
    };

    var Today = function(attrs){
        this.attrs = attrs;

        this.render = function(){
            var today = createElem('div', {class: 'today'});

            var period = new Period();
            var num_of_periods = this.attrs.today.length;
            for(var i=0; i<num_of_periods; i++){
                period.attrs = this.attrs.today[i];
                today.appendChild(period.render());
            }

            return today;
        };
    };

    var Day = function(attrs){
        this.attrs = attrs;

        this.render = function(){
            var weather = createElem('div', {class: 'weather'},
                '<span class="temp">' + this.attrs.temp + '&deg</span>' +
                '<span class="description">' + this.attrs.desc + '</span>'
            );
            var date = createElem('div', {class: 'date'},
                '<p class="weekday">' + this.attrs.weekday + '</p>' +
                '<p class="month">' + this.attrs.month + '</p>'
            );
            var imgWrapper = createElem('div', {class: 'img-wrapper'});
            imgWrapper.appendChild(createElem('img', {src: this.attrs.img, alt: 'icon'}));

            var day = createElem('div', {class: 'day'});
            day.appendChild(imgWrapper);
            day.appendChild(weather);
            day.appendChild(date);
            return day;
        };
    };

    var Forecast = function(attrs){
        this.attrs = attrs;

        this.render = function(){
            var forecast = createElem('div', {class: 'forecast'});

            var day = new Day();
            var num_of_days = this.attrs.days.length;
            for(var i=0; i<num_of_days; i++){
                day.attrs = this.attrs.days[i];
                forecast.appendChild(day.render());
            }
            return forecast;
        };
    };

    /*
    var todayData = [
        {time: '10:00', img: 'sun.png', temp: '15', precip: 0},
        {time: '13:00', img: 'sun.png', temp: '16', precip: 0},
        {time: '16:00', img: 'sun.png', temp: '19', precip: 0},
        {time: '19:00', img: 'sun.png', temp: '14', precip: 0},
        {time: '21:00', img: 'sun.png', temp: '11', precip: 0},
    ];
    */

    /*
    var forecastData = [
        {img: 'sun.png', temp: '14', desc: 'Sunny', weekday: 'Monday', month: 'January 19'},
        {img: 'sun.png', temp: '18', desc: 'Sunny', weekday: 'Monday', month: 'January 19'},
        {img: 'sun.png', temp: '12', desc: 'Sunny', weekday: 'Monday', month: 'January 19'},
        {img: 'sun.png', temp: '9', desc: 'Sunny', weekday: 'Monday', month: 'January 19'},
        {img: 'sun.png', temp: '13', desc: 'Sunny', weekday: 'Monday', month: 'January 19'}
    ];
    */

    var renderData = function(currentData, todayData, forecastData){
        var current = new Current(currentData);
        var today = new Today({today: todayData});
        var forecast = new Forecast({days: forecastData});

        // display data
        var main = document.getElementById('main');
        main.innerHTML = '';
        main.appendChild(current.render());
        main.appendChild(createElem('hr'));
        main.appendChild(today.render());
        main.appendChild(createElem('hr'));
        main.appendChild(forecast.render());
    };

    // used to parse the data
    var parseData = function(data){
        console.log(data);
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                        'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                      'August', 'September', 'October', 'November', 'December'];

        var currentData = {
            img: 'icons/' + data[0].weather[0].icon.substr(0, 2) + '.png',
            temp: Math.round(data[0].main.temp),
            desc: data[0].weather[0].main
        };

        var todayData = [];
        var i, date;
        for(i=0; i < 5; i++){
            // get time
            date = new Date(data[1].list[i].dt*1000); // ms
            var hours = '0' + date.getHours();
            hours = hours.substr(hours.length - 2); // pad to 2 digits
            var minutes = '0' + date.getMinutes();
            minutes = minutes.substr(minutes.length - 2); // pad again

            // get precipitation
            var precip = 0;
            if(data[1].list[i].rain)
                precip = +data[1].list[i].rain['3h'].toFixed(2);
            else if(data[1].list[i].snow)
                precip = +data[1].list[i].snow['3h'].toFixed(2);

            // store data in array
            todayData.push({
                img: 'icons/' + data[1].list[i].weather[0].icon.substr(0, 2) + '.png',
                temp: Math.round(data[1].list[i].main.temp),
                precip: precip,
                time: hours + ':' + minutes
            });
        }

        var forecastData = [];
        for(i=0; i < 5; i++){
            date = new Date(data[2].list[i].dt*1000); // ms
            forecastData.push({
                img: 'icons/' + data[2].list[i].weather[0].icon.substr(0, 2) + '.png',
                temp: Math.round(data[2].list[i].temp.max),
                desc: data[2].list[i].weather[0].main,
                weekday: weekdays[date.getDay()],
                month: months[date.getMonth()] + ' ' + date.getDate()
            });
        }

        renderData(currentData, todayData, forecastData);
    };

    var arrayAllTrue = function(arr){
        var arrLength = arr.length;
        for(var i=0; i < arrLength; i++)
            if(!arr[i]) return false;
        return true;
    };
    var cacheExpired = function(setAt){
        var EXPIRY_TIME = 30 * (60 * 1000); // min to milliseconds
        return (Date.now() - setAt) > EXPIRY_TIME;
    };

    // gets data and renders if arr is full
    var getData = function(key, url, arr, ind){
        chrome.storage.local.get(key, function(data){
            if(data[key] && !cacheExpired( JSON.parse(data[key]).setAt )){
                console.log('cache');
                arr[ind] = JSON.parse(data[key]);
                if(arrayAllTrue(arr))
                    parseData(arr);
            }else{
                var spinner = document.getElementById('spinner');
                spinner.style.display = 'block';
                ajax(url,
                    'GET',
                    function(r){
                        console.log('ajaxed');
                        var data = JSON.parse(r.response);
                        arr[ind] = data;

                        // cache with time of cache
                        var toStore = {};
                        data.setAt = Date.now();
                        toStore[key] = JSON.stringify(data);
                        chrome.storage.local.set(toStore);

                        if(arrayAllTrue(arr)){
                            parseData(arr);
                            spinner.style.display = 'none';
                        }
                    },
                    function(){console.log('error');}
                );
            }
        });
    };

    var LOCATION = 'waterloo,ca';
    var unitsBtns = document.getElementsByClassName('units-btn');

    var init = function(){
        var weatherData = [null, null, null];
        chrome.storage.sync.get('units', function(result){
            var units = result.units || 'metric';
            getData('currentWeatherData', 'http://api.openweathermap.org/data/2.5/weather?q=' + LOCATION + '&units=' + units, weatherData, 0);
            getData('todayWeatherData', 'http://api.openweathermap.org/data/2.5/forecast?q=' + LOCATION + '&units=' + units, weatherData, 1);
            getData('forecastWeatherData', 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + LOCATION + '&units=' + units, weatherData, 2);

            // set the units button
            var unitBtnsLength = unitsBtns.length;
            for(var i=0; i < unitBtnsLength; i++){
                if(unitsBtns[i].dataset.units == units) unitsBtns[i].setAttribute('class', 'units-btn active');
                else unitsBtns[i].setAttribute('class', 'units-btn');
            }
        });
    };
    init();

    // menu interactions
    var sidebar = document.getElementById('sidebar');
    // toggle the sidebar menu
    var toggleSidebar = function(){
        if(sidebar.style.display === 'block') sidebar.style.display = 'none';
        else sidebar.style.display = 'block';
    };
    // refresh data
    var refresh = function(){
        chrome.storage.local.clear(); // clear cache
        init(); // get data and re-render
        //toggleSidebar();
    };

    document.getElementById('menu-icon').onclick = toggleSidebar;
    document.getElementById('refresh').onclick = refresh;

    // change units
    Array.prototype.forEach.call(unitsBtns, function(elem, ind, arr){
        elem.onclick = function(e){
            chrome.storage.sync.set({'units': e.target.dataset.units});
            var arrLength = arr.length;
            for(var i=0; i < arrLength; i++)
                arr[i].setAttribute('class', 'units-btn');
            arr[ind].setAttribute('class', 'units-btn active');
            refresh();
        };
    });

})();

