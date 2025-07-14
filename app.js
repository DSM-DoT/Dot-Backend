const WebSocket = require('ws');

const brailleMap = {
    a: '100000',
    b: '101000',
    c: '110000',
    d: '110100',
    e: '100100',
    f: '111000',
    g: '111100',
    h: '101100',
    i: '011000',
    j: '011100',
    k: '100010',
    l: '101010',
    m: '110010',
    n: '110110',
    o: '100110',
    p: '111010',
    q: '111110',
    r: '101110',
    s: '011010',
    t: '011110',
    u: '100011',
    v: '101011',
    w: '011101',
    x: '110011',
    y: '110111',
    z: '100111'
};

const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket이 8888포트에에서 실행중');

wss.on('connection', function connection(ws) {
    console.log('클라 연결됨.');

    ws.on('message', function incoming(message) {
        console.log('수신됨:', message);

        const word = message.toString().toLowerCase();

        let binaryResult = '';

        for (const char of word) {
            if (brailleMap[char]) {
                binaryResult += brailleMap[char] + ' ';
            } else {
                binaryResult += '[?] ';//알파벳이 아닌경우
            }
        }

        ws.send(`'${word}' → ${binaryResult.trim()}`);
    });

    ws.on('close', function() {
        console.log('클라이언트 연결 끊김');
    });
});
