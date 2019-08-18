const chance = require('chance').Chance();
const WebSocket = require('ws');

const port = process.env.PORT || 5000;
const delay = 300;

const wss = new WebSocket.Server({ port });

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		setTimeout(() => {
			const data = JSON.parse(message);
			if (data.item) {
				data.item.guid = chance.guid();
			}
			ws.send(JSON.stringify(data));
		}, delay);
	});
});
