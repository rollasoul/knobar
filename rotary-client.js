var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const WebSocket = require('ws');
const ws = new WebSocket('wss://www.joyrats.com');
//const ws = new WebSocket('ws://localhost:3000');

//var port = new SerialPort('/dev/cu.wchusbserial14310', {
var port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200
});

var redis = require('redis');
var client = redis.createClient("redis://h:pc23ed9d77dcc726f777ea407262234cadd57756de398dc88799d4badcd609517@ec2-34-239-85-133.compute-1.amazonaws.com:57699");

client.on("error", function (err) {
   console.log("Error " + err);
});
// client.set("rotations", "0", redis.print);
// client.get("rotations", redis.print);

var offset = 0;
client.get("rotations", function (data) {
  if (data) {
    console.log(client.connected);
    console.log("OFFSET: ", data);
    offset = data;
  }
})

var lastInput = offset;
var lastSendTime = new Date();
var odd = false;

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', function (data) {
  var input = parseInt(data.toString('ascii')) + offset;

  if (odd) {
    // skip b/c:
    // there's a weird bug(?) where the rotary encoder sends n and n-1
    // at the same time and it's fucking with the light code
  } else {
    console.log('Data:', input);
    ws.send(input);
  }

  odd = !odd;
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


function updateOffset() {
  client.set("rotations", lastInput);
}

setInterval(updateOffset, 20000);


