var SerialPort = require('serialport');
const WebSocket = require('ws');
const ws = new WebSocket('wss://radiant-dusk-69055.herokuapp.com');

var port = new SerialPort('/dev/tty-usbserial1', {
    baudRate: 115200
});

//const ws = new WebSocket('ws://localhost:3000');


// Switches the port into "flowing mode"
// 
port.on('data', function (data) {
  console.log('Data:', data);
});

// Read data that is available but keep the stream from entering "flowing mode"
port.on('readable', function () {
  var data = port.read();
  console.log('Data:', data);
  ws.send(data);
});

