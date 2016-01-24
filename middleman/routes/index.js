var express = require('express'),
  router = express.Router();

var socketServer = require('../sockets.js');
var connections = socketServer.connections;
var numbers = socketServer.numbers;

var accountSid = 'AC2b346eafa10c27206fd5e0ab943e7224'; 
var authToken = '184cc6856f7916a6d824a156c3509339'; 
//var dsd = '[autkey]';
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken);

var twilio_number = "+12048179019";

//send texts from Html port
/*router.get('/', function(req, res) {
	client.messages.create({ 
    	to: "+12263505350", 
    	from: twilio_number, 
	    body: "Test Message", 
	}, function(err, message) { 
    	if(err){
    		console.log(err);
    	}
    	return res.json({okay:1});
	});
});
*/

//recieved texts
router.post('/receive',function(req,res){
	var number = (req.body.From).substring(2,req.body.From.length);
	var command = req.body.Body;
	//console.log(number);
	//console.log(connections);
	if(connections[number]){connections[number].write(command);}
});

router.post('/info',function(req,res){
	return res.json({phoneNum:twilio_number});
});

router.get('/ping',function(req,res){
	console.log("test ping");
});
module.exports = router;