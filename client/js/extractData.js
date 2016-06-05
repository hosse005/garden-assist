/* This script is for extracting charge and moisture data delivered from the server */

// Initial limits for relative calculation
var maxMoisture = 0;
var minMoisture = 4095;  // adc_max

$(function() {
    updateCharge();
    updateMoisture();
});

function updateCharge() {
    $.getJSON('/charge.json', function(data) {
	if (data.data > 80)
	    document.getElementById('charge').style.color = "green";
	else if (data.data < 20)
	    document.getElementById('charge').style.color = "red";
	
	document.getElementById('charge').innerHTML = Math.trunc(data.data) + "&#37";
    }).fail(function() {
	console.log("unable to read the charge.json file");
    });
}

function updateMoisture() {
    $.getJSON('/moisture.json', function(data) {

	// First loop through each reading, updating max/min as necessary
	data.data.forEach(function(entry) {
	    if (entry.moisture > maxMoisture && entry.moisture < 4000)  // Sanity check, adc_max = 4095
		maxMoisture = entry.moisture;
	    else if (entry.moisture < minMoisture && entry.moisture > 50)  // Open check
		minMoisture = entry.moisture;
	});
	console.log('minMoisture = ' + minMoisture);
	console.log('maxMoisture = ' + maxMoisture);

	// Now loop again, converting adc readings to relative percentage
	var relativeMoisture = { "data": [] };
	data.data.forEach(function(entry) {
	    percent = 100 * (entry.moisture - minMoisture) / (maxMoisture - minMoisture);
	    relativeMoisture.data.push({"moisture": percent, "timestamp": entry.timestamp});
	});

	// Plot the data in the JSON file
	Morris.Area({
	    element: 'moisture-chart',
	    data: relativeMoisture.data,
	    xkey: 'timestamp',
	    ykeys: ['moisture'],
	    labels: ['Relative Moisture'],
	    ymin: 0,
	    ymax: 100,
	    yLabelFormat: function(y) { return y.toString() + '%'; }
	});
    });
}
