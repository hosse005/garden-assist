/* This script contains the server entry point */

var express = require('express');
var path = require('path');
var pc = require('./ParticleController.js');

var app = express();
app.use(express.static(path.resolve('../client')));

app.get('/', function (req, res) {
    res.sendFile(path.resolve('../client/index.html'));
});

pc.particleSetup();

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});
