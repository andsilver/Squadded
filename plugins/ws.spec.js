import Vue from 'vue';
import ws, { WSToken } from './ws';

describe('WSToken wrapper', () => {
	it('should append _jwt from localStorage to sending object', () => {
		const mockJWT = 'some.user.jwt';
		const _ws = {
			sendObj: function () {},
		};
		const $ws = new WSToken(_ws);
		localStorage.setItem('userToken', mockJWT);

		spyOn(_ws, 'sendObj');

		expect($ws.sendObj).toEqual(jasmine.any(Function));
		$ws.sendObj({});

		expect(_ws.sendObj).toHaveBeenCalledTimes(1);
		expect(_ws.sendObj.calls.argsFor(0)).toEqual([ { _jwt: mockJWT } ]);
	});

	it('should remove error, guid and ts from sending object', () => {
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
			guid: null,
			error: null,
			ts: 1234567890123,
		});

		expect(_ws.sendObj).toHaveBeenCalledTimes(1);
		const payload = _ws.sendObj.calls.argsFor(0)[0];
		expect(payload).not.toHaveProperty('guid');
		expect(payload).not.toHaveProperty('error');
		expect(payload).not.toHaveProperty('ts');
		expect(payload).toHaveProperty('item');
	});

	it('should user token in localStorage as search query param for WS connection', () => {
		const mockToken = 'head.payload.sign';
		localStorage.setItem('userToken', mockToken);
		const store = {
			subscribe: function () {},
		};
		spyOn(Vue, 'use');

		ws({ store });

		expect(Vue.use).toHaveBeenCalledTimes(1);
		expect(Vue.use.calls.argsFor(0)[1].includes(`userToken=${mockToken}`)).toBe(true);
	});
});
