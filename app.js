const WebSocket = require('ws');

let clients = [];//앱, 웹, 단말기 등 소켓이 연결된 장치 배열

const wss = new WebSocket.Server({ port: process.env.PORT });//8080번 포트
console.log(`WebSocket이 ${process.env.PORT}번 포트에에서 실행중`);

wss.on('connection', (ws) => {
    console.log('연결됨.');
    clients.push(ws);

    //message == 전달받은 이진수 문자열
    ws.on('message', (input) => {//메세지 수신
      const data = JSON.parse(input);
      console.log('수신됨:', data.str, data.message);

      clients.forEach(v => {
        if(v !== ws) v.send(input);//메세지 송신
      })
    });

    ws.on('close', function() {
        console.log('연결 끊김');
        clients = clients.filter(v=>{
          return ws.id !== v.id
      })
    });
});
