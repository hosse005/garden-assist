/* This class is to be used for interacting with Particle API */

var fs = require('fs');
var Particle = require('particle-api-js');

var particle = new Particle();
var cfgFile = __dirname + '/particle-login.json';

module.exports = class ParticleController {
    constructor() {
	
	var cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));

	// Attempt login with given username and pw
	particle.login({username: cfg.username, password: cfg.password}).then(
	    function (data) {
		// Extract the access token
		var token = data.body.access_token;
		particle.listDevices({auth: token}).then(
		    function(devices) {
			// Extract the device id - just grab the first one for now..
			var devId = devices.body[0].id;

			// Now open up the event streams were interested in
			particle.getEventStream({deviceId: devId, auth: token}).then(
			    function(stream) {
				stream.on('moisture', function(data) {
				    var moisture = data.data;
				    var timestamp = data.published_at;
				    console.log('Moisture event: ' + data.data + ' @ ' + data.published_at);
				    // TODO - write the data to file
				});

				stream.on('charge', function(data) {
				    var charge = data.data;
				    var timestamp = data.published_at;
				    console.log('Charge event: ' + data.data + ' @ ' + data.published_at);
				    // TODO - write the data to file
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

}
