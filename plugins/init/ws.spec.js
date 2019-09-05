import Vue from 'vue';
import ws, { WSToken } from './ws';

describe('WSToken wrapper', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should remove error, userId, _jwt, guid and ts from sending object', () => {
		const mockJWT = 'some.user.jwt';
		const _ws = {
			sendObj: function () {},
		};
		const $ws = new WSToken(_ws);
		localStorage.setItem('userToken', mockJWT);

		spyOn(_ws, 'sendObj');

		expect($ws.sendObj).toEqual(jasmine.any(Function));
		$ws.sendObj({
			item: {},
			guid: 'someGuid',
			error: 'someError',
			userId: 'someUserId',
			ts: 1234567890123,
		});

		expect(_ws.sendObj).toHaveBeenCalledTimes(1);
		const payload = _ws.sendObj.calls.argsFor(0)[0];
		expect(payload).not.toHaveProperty('guid');
		expect(payload).not.toHaveProperty('error');
		expect(payload).not.toHaveProperty('ts');
		expect(payload).not.toHaveProperty('userId');
		expect(payload).not.toHaveProperty('_jwt');
		expect(payload).toHaveProperty('item');
	});

	it('should not send WS message if no user token', () => {
		localStorage.removeItem('userToken');
		const _ws = {
			sendObj: function () {},
		};
		const $ws = new WSToken(_ws);

		spyOn(_ws, 'sendObj');

		$ws.sendObj({
			item: {},
		});

		expect(_ws.sendObj).toHaveBeenCalledTimes(0);
	});

	it('should add user token from localStorage as search query param for WS connection', () => {
		const mockToken = 'head.payload.sign';
		localStorage.setItem('userToken', mockToken);
		const store = {
			subscribe: function () {},
		};
		spyOn(Vue, 'use');

		ws({ store });

		expect(Vue.use).toHaveBeenCalledTimes(1);
		expect(Vue.use.calls.argsFor(0)[1].includes(`userToken=${mockToken}`)).toBe(true);
		expect(Vue.use.calls.argsFor(0)[2].connectManually).toBe(false);
	});

	it('should not auto-connect WS if no user token', () => {
		const store = {
			subscribe: function () {},
		};
		spyOn(Vue, 'use');

		ws({ store });

		expect(Vue.use).toHaveBeenCalledTimes(1);
		expect(Vue.use.calls.argsFor(0)[2].connectManually).toBe(true);
	});
});
