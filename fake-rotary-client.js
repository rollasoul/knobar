const WebSocket = require('ws');
const ws = new WebSocket('wss://www.joyrats.com');

//const ws = new WebSocket('ws://localhost:3000');


var input = 0;

function publish() {
  input = (input + 1);
  console.log('Data:', input);
  ws.send(input);
}

setInterval(publish, 300);
