const http = require('http');
const WebSocket = require('ws');

/*

http 서버 생성
http서버 위에 ws 서버 생성
웹소켓으로 요청이 들어오기를 기다림
들어오면 clients에 집어넣고,log에 연결됨 출력
만약 메세지를 보내 message이벤트가 일어나면
clients에 있는 소켓들에게 메세지 전달

*/

// 1. HTTP 서버 생성
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('서버 정상 작동 중 (웹소켓 연결은 별도로 시도하세요).');
});

//ws 서버 생성
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  console.log('클라이언트 웹소켓 연결됨.');
  clients.push(ws);

  ws.on('message', (input) => {
    const data = JSON.parse(input);
    console.log('수신됨:', data);

    clients.forEach(v => {
      if (v !== ws) {
        v.send(JSON.stringify({ message: data.message, str: data.str }));
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('연결 종료됨');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`HTTP + WebSocket 서버가 ${PORT}포트에서 실행 중`);
});
