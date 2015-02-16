(function(){

    // gets the data from the server based on LOCATION
    var getData = function(LOCATION, success, error){

        var url = 'http://api.openweathermap.org/data/2.5/weather?id=' + LOCATION.id;
        var r = new XMLHttpRequest();
        r.open('GET', url, true);

        r.onload = function(){
            if(this.status >= 200 && this.status < 400)
                success(this); // success!
            else
                error(this);// reached server but error
        };

        r.onerror = function(){
             error(this);
        };

        r.send();
    };

    // updates the icon based on server response r
    var updateIcon = function(r){
        var data = JSON.parse(r.response);

        // cache for popup
        data.setAt = Date.now();
        chrome.storage.local.set({currentWeatherData: JSON.stringify(data)});

        // update icon itself
        var src;
        var image = data.weather[0].icon.substr(0, 2) + '.png';
        try{
            src = {
                19: 'icons/favicons19/' + image,
                38: 'icons/favicons38/' + image
            };
        }
        catch(err){
            src = { // default icon if error
                19: 'icons/favicons19/01.png',
                38: 'icons/favicons38/01.png'
            };
        }
        chrome.browserAction.setIcon({path: src});
    };

    // renders the default icon on error
    var defaultIcon = function(r){
        src = { // default icon if error
                19: 'icons/favicons19/01.png',
                38: 'icons/favicons38/01.png'
            };
        chrome.browserAction.setIcon({path: src});
    };

    // get the location from the browser and call callback
    var getLocation = function(callback){
        chrome.storage.sync.get('loc', function(data){
            // get location data or use waterloo
            data = data.loc && JSON.parse(data.loc);
            var LOCATION = {
                id: (data && data.id) || 6176823,
                name: (data && data.name) || 'waterloo'
            };

            callback(LOCATION);
        });
    };

    // initiate the update process
    var initUpdate = function(alarm){
        console.log('updating!');
        // run getLocation and update the icon
        getLocation(function(LOCATION){
            getData(LOCATION, updateIcon, defaultIcon);
        });
    };

    var forStartup = function(){
        // schedule alarm and add listener
        chrome.alarms.create('updateIcon', {periodInMinutes: 60});
        chrome.alarms.onAlarm.addListener(initUpdate);
        initUpdate();
    };

    chrome.runtime.onInstalled.addListener(forStartup);
    chrome.runtime.onStartup.addListener(forStartup);
    // used to track changes in location
    chrome.storage.onChanged.addListener(function(changes, namespace){
        if(namespace == 'sync' && 'loc' in changes){ // location held in sync
            console.log('location changed!');
            initUpdate();
        }
    });

})();
