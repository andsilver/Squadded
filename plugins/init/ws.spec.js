import Vue from 'vue';
import { Chance } from 'chance';
import { FeedStore, FeedActions, FeedGetters } from '../../store/feed';
import ws, * as wsPlugin from './ws';

const chance = new Chance();

describe('WS Plugin', () => {
	const mockToken = 'head.payload.sign';
	const { WS_LINK } = process.env;
	const STORE = {
		commit: function () {},
		dispatch: function () {},
		subscribe: function () {},
		getters: {
			[`${FeedStore}/${FeedGetters.items}`]: [],
		},
		state: {
			merchant: {
				id: null,
			},
		},
	};
	const { WSToken } = wsPlugin;

	describe('dispatch', () => {
		const { dispatch } = wsPlugin;
		let store;

		beforeEach(() => {
			store = Object.assign({}, STORE);
			spyOn(store, 'dispatch');
		});

		it(`should dispatch singleItemPost to ${FeedStore}/${FeedActions.receiveItem}`, () => {
			const msg = {
				type: 'singleItemPost',
			};

			dispatch(store, msg);
			expect(store.dispatch.calls.argsFor(0)).toEqual([ `${FeedStore}/${FeedActions.receiveItem}`, msg ]);
		});

		it(`should dispatch like to ${FeedStore}/${FeedActions.updateLike}`, () => {
			const msg = {
				type: 'like',
			};

			dispatch(store, msg);
			expect(store.dispatch.calls.argsFor(0)).toEqual([ `${FeedStore}/${FeedActions.updateLike}`, msg ]);
		});
	});

	describe('WSToken class', () => {
		beforeEach(() => {
			localStorage.clear();
		});

		it('should remove error, userId and _jwt from sending object', () => {
			const _ws = {
				sendObj: function () {},
			};
			const $ws = new WSToken(_ws);
			localStorage.setItem('userToken', mockToken);

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
			expect(payload).not.toHaveProperty('error');
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
	});

	describe('initSocket function', () => {
		const { initSocket } = wsPlugin;
		const link = 'ws://remote.mock.com/';
		let store;

		beforeEach(() => {
			localStorage.clear();
			store = Object.assign({}, STORE);
			spyOn(Vue, 'use');
		});

		it('should init socket witch exact connection link', () => {
			initSocket(link, store);

			expect(Vue.use).toHaveBeenCalledTimes(1);
			expect(Vue.use.calls.argsFor(0)[1]).toBe(link);
			expect(Vue.use.calls.argsFor(0)[2].connectManually).toBe(true);
		});

		it('should not add user token from localStorage as search query param for WS connection', () => {
			localStorage.setItem('userToken', mockToken);

			initSocket(link, store);

			expect(Vue.use).toHaveBeenCalledTimes(1);
			expect(Vue.use.calls.argsFor(0)[1].includes(`userToken=${mockToken}`)).toBe(false);
			expect(Vue.use.calls.argsFor(0)[2].connectManually).toBe(true);
		});

		it('should not auto-connect WS if no user token', () => {
			initSocket(link, store);

			expect(Vue.use).toHaveBeenCalledTimes(1);
			expect(Vue.use.calls.argsFor(0)[2].connectManually).toBe(true);
		});
	});

	describe('mutation listener', () => {
		let ctx;
		let state;
		let route;
		let _ws;
		let mutationDispatcher;

		function clear () {
			localStorage.clear();
			_ws = {
				sendObj: function () {},
			};
			state = {
				socket: {
					_ws,
					$ws: _ws,
				},
				merchant: { id: null },
			};
			route = {
				name: 'index',
			};
			ctx = {
				store: Object.assign({}, STORE),
				redirect: jest.fn(),
				route,
			};
			mutationDispatcher = wsPlugin.mutationListener(ctx.store, ctx.redirect, ctx.route);
		};

		describe('auth sequence', () => {
			beforeEach(clear);

			it('should do web socket response on authRequest', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authRequest' },
				};
				state.merchant.id = 'someMerchantId';
				localStorage.setItem('userToken', mockToken);

				spyOn(_ws, 'sendObj');

				mutationDispatcher(mutation, state);

				expect(_ws.sendObj).toHaveBeenCalledTimes(1);
				expect(_ws.sendObj.calls.argsFor(0)).toEqual([{
					type: 'authResponse',
					userToken: mockToken,
					merchantId: state.merchant.id,
				}]);
			});

			it('should set socket auth true on authOk', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};
				spyOn(ctx.store, 'commit');

				mutationDispatcher(mutation, state);

				expect(ctx.store.commit).toHaveBeenCalledTimes(1);
				expect(ctx.store.commit.calls.argsFor(0)).toEqual([ 'SET_SOCKET_AUTH', true ]);
			});

			it('should not dispatch socket messages while not auth', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'singleItemPost' },
				};
				spyOn(ctx.store, 'dispatch');

				mutationDispatcher(mutation, state);

				expect(ctx.store.dispatch).toHaveBeenCalledTimes(0);
			});

			it('should dispatch socket messages while auth Ok', () => {
				state.socket.isAuth = true;
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'singleItemPost' },
				};
				spyOn(ctx.store, 'dispatch');

				mutationDispatcher(mutation, state);

				expect(ctx.store.dispatch).toHaveBeenCalledTimes(1);
				expect(ctx.store.dispatch.calls.argsFor(0)).toEqual([ `${FeedStore}/${FeedActions.receiveItem}`, mutation.payload ]);
			});

			it('should disconnect when socket close', () => {
				const mutation = {
					type: 'SOCKET_ONCLOSE',
					payload: { reason: 'non empty' },
				};
				Vue.prototype.$disconnect = function () {};

				spyOn(ctx.store, 'commit');
				spyOn(Vue.prototype, '$disconnect');

				mutationDispatcher(mutation, state);

				expect(ctx.store.commit).toHaveBeenCalledTimes(1);
				expect(ctx.store.commit.calls.argsFor(0)).toEqual([ 'SET_SOCKET_AUTH', false ]);

				expect(Vue.prototype.$disconnect).toHaveBeenCalledTimes(1);
			});

			it('should fetch latest posts', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};

				spyOn(_ws, 'sendObj');

				mutationDispatcher(mutation, state);

				expect(_ws.sendObj).toHaveBeenCalledTimes(1);
				expect(_ws.sendObj.calls.argsFor(0)).toEqual([{
					type: 'fetchPosts',
				}]);
			});

			it('should fetch posts later than storred', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};
				const latestItem = { ts: new Date(chance.date()).getTime() };
				ctx.store.getters[`${FeedStore}/${FeedGetters.items}`].push(latestItem);

				spyOn(_ws, 'sendObj');

				mutationDispatcher(mutation, state);

				expect(_ws.sendObj).toHaveBeenCalledTimes(1);
				expect(_ws.sendObj.calls.argsFor(0)).toEqual([{
					type: 'fetchPosts',
					ts: latestItem.ts,
				}]);
			});
		});

		describe('redirect', () => {
			beforeEach(clear);

			it('should redirect to feed from home on auth', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};

				mutationDispatcher(mutation, state);

				expect(ctx.redirect).toHaveBeenCalledTimes(1);
				expect(ctx.redirect.mock.calls[0]).toEqual([ { path: '/feed' } ]);
			});

			it('should redirect to home from any on unauth', () => {
				const mutation = {
					type: 'SOCKET_ONCLOSE',
					payload: { reason: 'non empty' },
				};
				route.name = 'notHome';

				mutationDispatcher(mutation, state);

				expect(ctx.redirect).toHaveBeenCalledTimes(1);
				expect(ctx.redirect.mock.calls[0]).toEqual([ { path: '/' } ]);
			});
		});
	});

	describe('default', () => {
		let ctx;
		beforeEach(() => {
			localStorage.clear();
			ctx = {
				store: Object.assign({}, STORE),
				redirect: function () {},
				route: {},
			};
		});

		it('should invoke proper init sequence', () => {
			spyOn(wsPlugin, 'initSocket');
			spyOn(wsPlugin, 'mutationListener').and.callThrough();
			spyOn(ctx.store, 'subscribe');

			ws(ctx);

			expect(wsPlugin.initSocket).toHaveBeenCalledTimes(1);
			expect(wsPlugin.initSocket.calls.argsFor(0)).toEqual([ WS_LINK, ctx.store ]);

			expect(wsPlugin.mutationListener).toHaveBeenCalledTimes(1);
			expect(wsPlugin.mutationListener.calls.argsFor(0)).toEqual([ ctx.store, ctx.redirect, ctx.route ]);

			expect(ctx.store.subscribe).toHaveBeenCalledTimes(1);
			const func = ctx.store.subscribe.calls.argsFor(0)[0];
			expect(func.name).toBe('mutationDispatcher');
		});
	});
});
