/* This script is for extracting charge and moisture data delivered from the server */

$(function() {
    // Test chart
    Morris.Area({
	element: 'testchart',
	data: [
	    { time: '2006', moisture: 90 },
	    { time: '2007', moisture: 80 },
	    { time: '2008', moisture: 73 },
	    { time: '2009', moisture: 61 },
	    { time: '2010', moisture: 33 },
	    { time: '2011', moisture: 20 },
	    { time: '2012', moisture: 95 }],
	xkey: 'time',
	ykeys: ['moisture'],
	labels: ['Relative Moisture'],
	ymin: 0,
	ymax: 100,
	yLabelFormat: function(y) {
	    return y.toString() + '%';
	}
    });

    updateCharge();
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
