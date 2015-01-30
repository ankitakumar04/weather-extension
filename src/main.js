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
            var num_of_periods = this.attrs.todayData.length;
            for(var i=0; i<num_of_periods; i++){
                period.attrs = this.attrs.todayData[i];
                today.appendChild(period.render());
            }

            return today;
        };
    };

    var todayData = [
    {time: '10:00', img: 'sun.png', temp: '15', precip: 0},
    {time: '10:00', img: 'sun.png', temp: '15', precip: 0},
    {time: '10:00', img: 'sun.png', temp: '15', precip: 0},
    {time: '10:00', img: 'sun.png', temp: '15', precip: 0},
    {time: '10:00', img: 'sun.png', temp: '15', precip: 0},
    ];

    var current = new Current({img: 'sun.png', temp: '15', desc: 'Sunny'});
    var today = new Today({todayData: todayData});
    document.body.insertBefore(current.render(), document.getElementById('current-hr'));
    document.body.insertBefore(today.render(),  document.getElementById('today-hr'));

})();
