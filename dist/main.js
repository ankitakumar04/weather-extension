var components=function(){var t=function(t,e,n){var a=document.createElement(t);for(var s in e)a.setAttribute(s,e[s]);return a.innerHTML=n||null,a},e=function(e){this.attrs=e,this.render=function(){var e=t("div",{"class":"current"}),n=t("img",{"class":"current-img",src:this.attrs.img,alt:"icon"}),a=t("div",{"class":"weather"});return a.appendChild(t("span",{},this.attrs.temp+"&deg")),a.appendChild(t("span",{},this.attrs.desc)),e.appendChild(n),e.appendChild(a),e}},n=function(e){this.attrs=e,this.render=function(){var e=t("div",{"class":"period"});return e.appendChild(t("span",{"class":"time"},this.attrs.time)),e.appendChild(t("img",{src:this.attrs.img,alt:"icon"})),e.appendChild(t("span",{"class":"temp"},this.attrs.temp+"&deg")),e.appendChild(t("span",{"class":"precip"},this.attrs.precip+"mm")),e}},a=function(e){this.attrs=e,this.render=function(){for(var e=t("div",{"class":"today"}),a=new n,s=this.attrs.today.length,r=0;s>r;r++)a.attrs=this.attrs.today[r],e.appendChild(a.render());return e}},s=function(e){this.attrs=e,this.render=function(){var e=t("div",{"class":"weather"},'<span class="temp">'+this.attrs.temp+'&deg</span><span class="description">'+this.attrs.desc+"</span>"),n=t("div",{"class":"date"},'<p class="weekday">'+this.attrs.weekday+'</p><p class="month">'+this.attrs.month+"</p>"),a=t("div",{"class":"img-wrapper"});a.appendChild(t("img",{src:this.attrs.img,alt:"icon"}));var s=t("div",{"class":"day"});return s.appendChild(a),s.appendChild(e),s.appendChild(n),s}},r=function(e){this.attrs=e,this.render=function(){for(var e=t("div",{"class":"forecast"}),n=new s,a=this.attrs.days.length,r=0;a>r;r++)n.attrs=this.attrs.days[r],e.appendChild(n.render());return e}};return{Current:e,Period:n,Today:a,Day:s,Forecast:r}}();!function(){var t=function(t,e,n,a){var s=new XMLHttpRequest;s.open(e,t,!0),s.onload=function(){this.status>=200&&this.status<400?n(this):a(this)},s.onerror=function(){a(this)},s.send()},e=function(t){for(var e=t.length,n=0;e>n;n++)if(!t[n])return!1;return!0},n=function(t){var e=18e5;return Date.now()-t>e},a=function(t,e,n){var a=new components.Current(t),s=new components.Today({today:e}),r=new components.Forecast({days:n}),i=document.getElementById("main");i.innerHTML="",i.appendChild(a.render()),i.appendChild(document.createElement("hr")),i.appendChild(s.render()),i.appendChild(document.createElement("hr")),i.appendChild(r.render())},s=function(t){console.log(t);var e,n,s=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],r=["January","February","March","April","May","June","July","August","September","October","November","December"],i={img:"icons/"+t[0].weather[0].icon.substr(0,2)+".png",temp:Math.round(t[0].main.temp),desc:t[0].weather[0].main},o=[];for(e=0;5>e;e++){n=new Date(1e3*t[1].list[e].dt);var c="0"+n.getHours();c=c.substr(c.length-2);var d="0"+n.getMinutes();d=d.substr(d.length-2);var l=0;t[1].list[e].rain?l=+t[1].list[e].rain["3h"].toFixed(2):t[1].list[e].snow&&(l=+t[1].list[e].snow["3h"].toFixed(2)),o.push({img:"icons/"+t[1].list[e].weather[0].icon.substr(0,2)+".png",temp:Math.round(t[1].list[e].main.temp),precip:l,time:c+":"+d})}var p=[];for(e=0;5>e;e++)n=new Date(1e3*t[2].list[e].dt),p.push({img:"icons/"+t[2].list[e].weather[0].icon.substr(0,2)+".png",temp:Math.round(t[2].list[e].temp.max),desc:t[2].list[e].weather[0].main,weekday:s[n.getDay()],month:r[n.getMonth()]+" "+n.getDate()});a(i,o,p)},r=function(a,r,i,o){chrome.storage.local.get(a,function(c){if(c[a]&&!n(JSON.parse(c[a]).setAt))console.log("cache"),i[o]=JSON.parse(c[a]),e(i)&&s(i);else{var d=document.getElementById("spinner");d.style.display="block",t(r,"GET",function(t){console.log("ajaxed");var n=JSON.parse(t.response);i[o]=n;var r={};n.setAt=Date.now(),r[a]=JSON.stringify(n),chrome.storage.local.set(r),e(i)&&(s(i),d.style.display="none")},function(){console.log("error")})}})},i="waterloo,ca",o=function(){var t=[null,null,null];chrome.storage.sync.get("units",function(e){var n=e.units||"metric";r("currentWeatherData","http://api.openweathermap.org/data/2.5/weather?q="+i+"&units="+n,t,0),r("todayWeatherData","http://api.openweathermap.org/data/2.5/forecast?q="+i+"&units="+n,t,1),r("forecastWeatherData","http://api.openweathermap.org/data/2.5/forecast/daily?q="+i+"&units="+n,t,2);for(var a=document.getElementsByClassName("units-btn"),s=a.length,o=0;s>o;o++)a[o].dataset.units==n?a[o].setAttribute("class","units-btn active"):a[o].setAttribute("class","units-btn")})};o();var c=function(){var t=document.getElementById("sidebar");t.style.display="block"===t.style.display?"none":"block"},d=function(){chrome.storage.local.clear(),o()};document.getElementById("menu-icon").onclick=c,document.getElementById("refresh").onclick=d;var l=document.getElementsByClassName("units-btn");Array.prototype.forEach.call(l,function(t,e,n){t.onclick=function(t){chrome.storage.sync.set({units:t.target.dataset.units});for(var a=n.length,s=0;a>s;s++)n[s].setAttribute("class","units-btn");n[e].setAttribute("class","units-btn active"),d()}})}();