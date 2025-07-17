const http = require('http');
const WebSocket = require('ws');

// 1. HTTP 서버 생성
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('서버 정상 작동 중 (웹소켓 연결은 별도로 시도하세요).');
});

// 2. WebSocket 서버를 HTTP 서버 위에 생성
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

// 3. 포트 리스닝 (Railway에서 이 포트로 접근)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`HTTP + WebSocket 서버가 ${PORT}포트에서 실행 중`);
});
