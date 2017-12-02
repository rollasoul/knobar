var SerialPort = require('serialport');
const WebSocket = require('ws');
const ws = new WebSocket('wss://www.joyrats.com');

var port = new SerialPort('/dev/cu.wchusbserial14610', {
    baudRate: 115200
});

//const ws = new WebSocket('ws://localhost:3000');


// Switches the port into "flowing mode"
// 
port.on('data', function (data) {
  var input = parseInt(data.toString('ascii'));
  console.log('Data:', input);
  ws.send(input);
});

// Read data that is available but keep the stream from entering "flowing mode"
port.on('readable', function () {
  var data = port.read();
  console.log('Readable:', data);
  ws.send(data);
});

