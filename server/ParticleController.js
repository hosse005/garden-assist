/* This class is to be used for interacting with Particle API */

var fs = require('fs');
var Particle = require('particle-api-js');

var particle = new Particle();
var cfgFile = './particle-login.json';

module.exports = class ParticleController {
    constructor() {
	
	var cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
	this.user = cfg.username;
	this.pw = cfg.password;

	// Attempt login with given username and pw and store access token
	particle.login({username: this.user,
			password: this.pw}).then(
			    function (data) {
				console.log('API call completed on promise resolve: ', data.body.access_token);
				console.log(data);
			    },
			    function (err) {
				console.log('Particle API login credentials failed');
				console.log('Check contents of the particle-login.json file\n\n');
				console.log(err);
				process.exit(0);
			    }
			);
	
    }

    
}
