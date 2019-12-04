const KEEP_ALIVE_INTERVAL_MS = 30000;

export class WSToken {
	constructor(ws) {
		this._ws = ws;
		this._timeoutId = null;
	}

	sendObj (data) {
		const _jwt = localStorage.getItem('userToken');
		if (_jwt) {
			const { error, userId, _jwt, ...clean } = data;
			this._ws.sendObj(clean);
			this.stop();
			this.keepAlive();
		}
	}

	keepAlive() {
		this._timeoutId = setTimeout(() => {
			this._ws.send(JSON.stringify({ type: 'ping' }));
			this.keepAlive();
		}, KEEP_ALIVE_INTERVAL_MS);
	}

	stop () {
		clearTimeout(this._timeoutId);
	}
}
