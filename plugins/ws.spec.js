import { WSToken } from './ws';

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
});
