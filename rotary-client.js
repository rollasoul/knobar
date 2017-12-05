var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const WebSocket = require('ws');
const ws = new WebSocket('wss://www.joyrats.com');
//const ws = new WebSocket('ws://localhost:3000');

var port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200
});

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', function (data) {
  var input = parseInt(data.toString('ascii'));
  console.log('Data:', data.toString('ascii'));
  ws.send(input);
});

// Read data that is available but keep the stream from entering "flowing mode"
//port.on('readable', function () {
//  var data = port.read();
//  console.log('Readable:', data);
//  ws.send(data);
//});
//
