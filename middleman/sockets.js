var net = require('net');

var connections = {};
var numbers = {};
var accountSid = 'AC2b346eafa10c27206fd5e0ab943e7224'; 
var authToken = '184cc6856f7916a6d824a156c3509339'; 
//var dsd = '[autkey]';
 
//require the Twilio module and create a REST client 
var twilio_client = require('twilio')(accountSid, authToken);

var twilio_number = "+12048179019";

var server = net.createServer(function(client) {
	client.on('data', function(data) {
		console.log(data.toString());
		var dataObj = JSON.parse(data.toString());
		if(dataObj.number) {
			connections[dataObj.number] = client;
			numbers[client] = dataObj.number;
		}
		if(dataObj.server_response){
			console.log(dataObj.server_response);
			twilio_client.messages.create({ 
		    	to: numbers[client], 
		    	from: twilio_number, 
			    body: dataObj.server_response, 
			}, function(err, message) { 
		    	if(err){
		    		console.log(err);
		    	}
			});
		}
	});

	client.on('error', function(error) {
		console.log(error);

		var number = numbers[client];
		delete numbers[client];
		delete connections[number];
	});

	client.on('close', function() {
		console.log('connection lost.');

		var number = numbers[client];
		delete numbers[client];
		delete connections[number];
	});
});

server.listen(1337, function() {
	console.log('socket server running on 1337');
});

module.exports = {
	connections: connections,
	numbers: numbers
};
