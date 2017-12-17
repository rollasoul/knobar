var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const WebSocket = require('ws');
const ws = new WebSocket('wss://www.joyrats.com');
//const ws = new WebSocket('ws://localhost:3000');

//var port = new SerialPort('/dev/cu.wchusbserial14310', {
var port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200
});

var offset = 0;
var lastInput = offset;
var lastSendTime = new Date();

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', function (data) {
  var input = parseInt(data.toString('ascii')) + offset;
  console.log('Data:', input);
  ws.send(input);

  lastInput = input;
  lastSendTime = new Date();
});

// Read data that is available but keep the stream from entering "flowing mode"
//port.on('readable', function () {
//  var data = port.read();
//  console.log('Readable:', data);
//  ws.send(data);
//});

// repeat the input every 10 seconds if needed to keep websocket alive...
function repeatToKeepAlive() {
  if (lastInput !== undefined) {
    var now = new Date();
    if (now - lastSendTime > 10*1000) {
      console.log('KeepAlive repeat:', lastInput);
      ws.send(lastInput);
      lastSendTime = now;
    }
  }
}

setInterval(repeatToKeepAlive, 2000);
