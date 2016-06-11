/* This script is for fetching and displaying the current weather */

$(document).ready(function() {
    $.simpleWeather({
	location: 'Wauwatosa, WI',
	woeid: '',
	unit: 'c',
	success: function(weather) {
	    $("#temp").html(weather.temp + '&deg' + weather.units.temp);
	    if (weather.temp > 30)
		document.getElementById('temp').style.color = "red";
	    else if (weather.temp < 15)
		document.getElementById('temp').style.color = "darkblue";
	},
	error: function(err) {
	    console.log('Unable to fetch weather data');
	}
    });
});

