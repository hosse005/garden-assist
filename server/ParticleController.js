/* This script is to be used for interacting with the Particle API */

var fs = require('fs');
var path = require('path');
var Particle = require('particle-api-js');

var particle = new Particle();
var cfgFile = __dirname + '/particle-login.json';

var moistureFile = path.resolve(__dirname + '/../client/moisture.json');
var chargeFile = path.resolve(__dirname + '/../client/charge.json');

function removeFile(file) {
    fs.access(file, (err) => {
	if (!err) { fs.unlink(file); }
    });
}

function writeFile(file, data) {
    fs.writeFile(file,
		 JSON.stringify(data) + '\n',
		 (err) => { if (err) console.log(err); });
}

function addMoistureData(file, entry) {
    fs.readFile(file, (err, data) => {
	var moistureJSON = { "data": [] };

	// Only try parse file if open didn't fail
	if (!err) {
	    moistureJSON = JSON.parse(data);

	    // Check to see if we need to remove some old records
	    if (moistureJSON.data.length >= 600)
		moistureJSON.data = moistureJSON.data.slice(100,moistureJSON.data.length);
	}

	moistureJSON.data.push(entry);
	writeFile(file, moistureJSON);
    });
}

module.exports = {
    particleSetup: function() {

	// Clear any existing data files
	removeFile(moistureFile);
	removeFile(chargeFile);

	var cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));

	// Attempt login with given username and pw
	particle.login({username: cfg.username, password: cfg.password}).then(function(data) {
	    // Extract the access token
	    var token = data.body.access_token;
	    particle.listDevices({auth: token}).then(function(devices) {
		// Extract the device id - just grab the first one for now..
		var devId = devices.body[0].id;

		// Now open up the event streams were interested in
		particle.getEventStream({deviceId: devId, auth: token}).then(function(stream) {
		    stream.on('moisture', function(data) {
			var moisture = data.data;
			var timestamp = data.published_at;
			console.log('Moisture event: ' + moisture + ' @ ' + timestamp);
			var dataJSON = { "moisture": moisture, "timestamp": timestamp };
			addMoistureData(moistureFile, dataJSON);
		    });

		    stream.on('charge', function(data) {
			var charge = data.data;
			var timestamp = data.published_at;
			console.log('Charge event: ' + data.data + ' @ ' + data.published_at);
			writeFile(chargeFile, data);
		    });
		},
		function(err) {
		    console.log('Failed to get the event stream');
		    console.log(err);
		    process.exit(0);
		});
	    },
	    function(err) {
		console.log('Failed to query devices for the given account!');
		console.log(err);
		process.exit(0);
	    });
	},
        function (err) {
	    console.log('Particle login failed, check particle-login.json\n\n');
	    console.log(err);
	    process.exit(0);
	});
    }
};
