import Vue from 'vue';
import { Chance } from 'chance';
import ws, * as wsPlugin from './ws';
import { FeedStore, FeedActions, FeedGetters, FeedMutations } from '~/store/feed';
import { UserStore, UserMutations } from '~/store/user';
import { userMockBuilder } from '~/test/user.mock';

const chance = new Chance();

describe('WS Plugin', () => {
	const mockToken = 'head.payload.sign';
	const { WS_LINK } = process.env;
	const STORE = {
		getters: {
			[`${FeedStore}/${FeedGetters.items}`]: [],
		},
		state: {
			merchant: {
				id: null,
			},
			user: {
				me: {},
			},
			squad: {
				path: '/default',
			},
		},
	};
	const { WSToken } = wsPlugin;

	describe('dispatch', () => {
		const { dispatch } = wsPlugin;
		let _ws;
		let store;

		beforeEach(() => {
			const deepStore = JSON.parse(JSON.stringify(STORE));
			store = Object.assign({
				commit: jest.fn(),
				dispatch: jest.fn(),
				subscribe: jest.fn(),
			}, deepStore);
			_ws = {
				sendObj: jest.fn(),
			};
			store.state.socket = {
				_ws,
				$ws: _ws,
			};
		});

		it(`should pong`, () => {
			const msg = {
				type: 'ping',
			};

			dispatch(store, msg);
			expect(_ws.sendObj).toHaveBeenCalledWith({ type: 'pong' });
		});

		it(`should dispatch singleItemPost to ${FeedStore}/${FeedActions.receiveItem}`, () => {
			const msg = {
				type: 'singleItemPost',
			};

			dispatch(store, msg);
			expect(store.dispatch).toHaveBeenCalledWith(`${FeedStore}/${FeedActions.receiveItem}`, msg);
		});

		it(`should dispatch like to ${FeedStore}/${FeedActions.updateLike}`, () => {
			const msg = {
				type: 'like',
			};

			dispatch(store, msg);
			expect(store.dispatch).toHaveBeenCalledWith(`${FeedStore}/${FeedActions.updateLike}`, msg);
		});

		it(`should commit comments to ${FeedStore}/${FeedMutations.receiveComments}`, () => {
			const msg = {
				type: 'comments',
			};

			dispatch(store, msg);
			expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.receiveComments}`, msg);
		});

		it(`should commit visitor user to ${UserStore}/${UserMutations.setMe}`, () => {
			const user = userMockBuilder().get();
			const msg = {
				type: 'userProfile',
				user,
			};
			store.state.user.me.userId = user.userId;

			dispatch(store, msg);
			expect(store.commit).toHaveBeenCalledWith(`${UserStore}/${UserMutations.setMe}`, user);
		});

		it(`should commit other user to ${UserStore}/${UserMutations.setOther}`, () => {
			const user = userMockBuilder().get();
			const msg = {
				type: 'userProfile',
				user,
			};
			store.state.user.me.userId = 'myUserId';

			dispatch(store, msg);
			expect(store.commit).toHaveBeenCalledWith(`${UserStore}/${UserMutations.setOther}`, user);
		});
	});

	describe('WSToken class', () => {
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

	describe('initSocket function', () => {
		const { initSocket } = wsPlugin;
		const link = 'ws://remote.mock.com/';
		let store;

		beforeEach(() => {
			localStorage.clear();
			const deepStore = JSON.parse(JSON.stringify(STORE));
			store = Object.assign({
				commit: jest.fn(),
				dispatch: jest.fn(),
				subscribe: jest.fn(),
			}, deepStore);
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
			const deepStore = JSON.parse(JSON.stringify(STORE));
			_ws = {
				sendObj: jest.fn(),
			};
			state = deepStore.state;
			route = {
				name: 'index',
			};
			ctx = {
				store: Object.assign({
					commit: jest.fn(),
					dispatch: jest.fn(),
					subscribe: jest.fn(),
				}, deepStore),
				redirect: jest.fn(),
				route,
			};
			ctx.store.state.socket = {
				_ws,
				$ws: _ws,
			};
			mutationDispatcher = wsPlugin.mutationListener(ctx);
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

				mutationDispatcher(mutation, state);

				expect(_ws.sendObj).toHaveBeenCalledTimes(1);
				expect(_ws.sendObj).toHaveBeenCalledWith({
					type: 'authResponse',
					userToken: mockToken,
					merchantId: state.merchant.id,
				});
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

			it('should set pending false if authOk occur after destination page was mounted', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};
				spyOn(ctx.store, 'commit');
				route.name = 'notHome';

				mutationDispatcher(mutation, state);

				expect(ctx.store.commit).toHaveBeenCalledTimes(2);
				expect(ctx.store.commit.calls.argsFor(1)).toEqual([ 'SET_PENDING', false ]);
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
				expect(ctx.store.dispatch).toHaveBeenCalledWith(`${FeedStore}/${FeedActions.receiveItem}`, mutation.payload);
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

				expect(ctx.store.commit).toHaveBeenCalledTimes(2);
				expect(ctx.store.commit.calls.argsFor(0)).toEqual([ 'SET_SOCKET_AUTH', false ]);
				expect(ctx.store.commit.calls.argsFor(1)).toEqual([ 'SET_PENDING', false ]);

				expect(Vue.prototype.$disconnect).toHaveBeenCalledTimes(1);
			});

			it('should fetch latest posts', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};

				mutationDispatcher(mutation, state);

				expect(_ws.sendObj).toHaveBeenCalledTimes(2);
				expect(_ws.sendObj).toHaveBeenCalledWith({
					type: 'fetchPosts',
				});
			});

			it('should fetch current user', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};

				mutationDispatcher(mutation, state);

				expect(_ws.sendObj).toHaveBeenCalledTimes(2);
				expect(_ws.sendObj).toHaveBeenCalledWith({
					type: 'fetchUser',
				});
			});

			it('should fetch posts later than storred', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};
				const latestItem = { ts: new Date(chance.date()).getTime() };
				ctx.store.getters[`${FeedStore}/${FeedGetters.items}`].push(latestItem);

				mutationDispatcher(mutation, state);

				expect(_ws.sendObj).toHaveBeenCalledTimes(2);
				expect(_ws.sendObj).toHaveBeenCalledWith({
					type: 'fetchPosts',
					ts: latestItem.ts,
				});
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
				expect(ctx.redirect).toHaveBeenCalledWith(state.squad.route);
			});

			it('should redirect to home from any on unauth', () => {
				const mutation = {
					type: 'SOCKET_ONCLOSE',
					payload: { reason: 'non empty' },
				};
				route.name = 'notHome';

				mutationDispatcher(mutation, state);

				expect(ctx.redirect).toHaveBeenCalledTimes(1);
				expect(ctx.redirect).toHaveBeenCalledWith({ path: '/' });
			});
		});
	});

	describe('default', () => {
		let ctx;
		beforeEach(() => {
			localStorage.clear();
			const deepStore = JSON.parse(JSON.stringify(STORE));
			ctx = {
				store: Object.assign({
					commit: jest.fn(),
					dispatch: jest.fn(),
					subscribe: jest.fn(),
				}, deepStore),
				redirect: jest.fn(),
				route: {},
			};
		});

		it('should invoke proper init sequence', () => {
			spyOn(wsPlugin, 'initSocket');
			spyOn(wsPlugin, 'mutationListener').and.callThrough();

			ws(ctx);

			expect(wsPlugin.initSocket).toHaveBeenCalledTimes(1);
			expect(wsPlugin.initSocket).toHaveBeenCalledWith(WS_LINK, ctx.store);

			expect(wsPlugin.mutationListener).toHaveBeenCalledTimes(1);
			expect(wsPlugin.mutationListener).toHaveBeenCalledWith(ctx);

			expect(ctx.store.subscribe).toHaveBeenCalledTimes(1);
			const func = ctx.store.subscribe.mock.calls[0][0];
			expect(func.name).toBe('mutationDispatcher');
		});
	});
});
