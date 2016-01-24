// smsc
var net = require('net'),
    crypto = require('crypto'),
    exec = require('child_process').exec,
    chalk = require('chalk');

process.chdir('/home/ubuntu');

var child;

var BASE_URL = 'http://csms.duelist.io';
var HOST = 'csms.duelist.io';
var PORT = 1337;

var options = process.argv;
if(!options[2] || options[2].toString().length != 10) {
  throw 'You must provide a valid number.';
}

var number = options[2];

var client = net.Socket();
client.connect(PORT, HOST, function() {
  var outputObj = {
    number: number
  };

  client.write(JSON.stringify(outputObj));
});

console.log(chalk.green.bold('CSMS v0.0.1 RUNNING (#' + number + ')'));
console.log(chalk.green.italic('You may now start texting commands to this server!'));
console.log(chalk.green.italic('It is suggested that your run this as a pm2 service!'));

client.on('data', function(data) {
  data = data.toString();
  var pData = data.split(' ');
  if(pData[0] == 'sudo' || pData[0] == 'su' || pData[0] == 'vim' || pData[0] == 'nano')
    client.write(JSON.stringify({ 'server_response': 'You are not allowed to use sudo commands!' }));

  if(data.split(' ')[0] == 'cd') {
    try {
      process.chdir(data.split(' ')[1]);
      client.write(JSON.stringify({ 'cd': 1 }));
    }
    catch(err) {
      client.write(JSON.stringify({ 'cd': 0 }));
    }
  }
  else {
    child = exec(data, function(error, stdout, stderr) {
      // if(error) { client.write(JSON.stringify({ 'server_response': JSON.stringify(error) })); }
      if(stderr) { client.write(JSON.stringify({ 'server_response': stderr })); }
      else {
        var times = Math.floor(stdout.length / 1500);
        if(times != 0) {
          var i;
          for(i = 0; i < (times * 1500); i += 1500) {
            client.write(JSON.stringify({ 'server_response': stdout.substring(i, i + 1500) }));
          }

          if(stdout.length % 1500 != 0) {
            client.write(JSON.stringify({ 'server_response': stdout.substring(i, stdout.length) }));
          }
        }
        else { client.write(JSON.stringify({ 'server_response': stdout })); }
      }
    });

    child;
  }
});

client.on('error', function(error) {
  console.log(error);
  throw 500;
});

client.on('close', function() {
  throw 'Connection lost.';
});
