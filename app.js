const WebSocket = require('ws');
require('dotenv').config();

let clients = [];//앱, 웹, 단말기 등 소켓이 연결된 장치 배열

const wss = new WebSocket.Server({ port: process.env.PORT_WS });//8080번 포트
console.log(`WebSocket이 ${process.env.PORT_WS}번 포트에에서 실행중`);

wss.on('connection', (ws) => {
    console.log('연결됨.');
    clients.push(ws);

    ws.on('message', (input) => {
      const message = JSON.parse(input).message;
      console.log('수신됨:', message);

      clients.forEach(v => {
        if(v !== ws) v.send(JSON.stringify({message: message}));
      })
    });


    ws.on('close', function() {
        console.log('연결 끊김');
        clients = clients.filter(v=>{
          return ws.id !== v.id
      })
    });
});