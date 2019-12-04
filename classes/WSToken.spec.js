import { WSToken } from './WSToken';

describe('WSToken class', () => {
	const mockToken = 'head.payload.sign';

	beforeEach(() => {
		localStorage.clear();
	});

	it('should remove error, userId and _jwt from sending object', () => {
		const _ws = {
			sendObj: jest.fn(),
		};
		const $ws = new WSToken(_ws);
		localStorage.setItem('userToken', mockToken);

		expect($ws.sendObj).toEqual(jasmine.any(Function));
		$ws.sendObj({
			item: {},
			guid: 'someGuid',
			error: 'someError',
			userId: 'someUserId',
			ts: 1234567890123,
		});

		expect(_ws.sendObj).toHaveBeenCalledTimes(1);
		const payload = _ws.sendObj.mock.calls[0][0];
		expect(payload).not.toHaveProperty('error');
		expect(payload).not.toHaveProperty('userId');
		expect(payload).not.toHaveProperty('_jwt');
		expect(payload).toHaveProperty('item');
	});

	it('should not send WS message if no user token', () => {
		localStorage.removeItem('userToken');
		const _ws = {
			sendObj: jest.fn(),
		};
		const $ws = new WSToken(_ws);

		$ws.sendObj({
			item: {},
		});

		expect(_ws.sendObj).toHaveBeenCalledTimes(0);
	});
});
