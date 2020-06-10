import Vue from 'vue';
import ws, * as wsPlugin from './ws';
import { WSMessages } from '~/classes/WSMessages';
import { PostActions, PostStore } from '~/store/post';
import { FeedStore, FeedGetters } from '~/store/feed';
import { isHome, isOnboarding, prefetch } from '~/helpers';
import { UserStore, UserMutations } from '~/store/user';
import { DEFAULT_LANDING } from '~/store/squad';

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
	isHome: jest.fn(),
	isOnboarding: jest.fn(),
}));

describe('WS Plugin', () => {
	const mockToken = 'head.payload.sign';
	const { WS_LINK } = process.env;
	const STORE = {
		getters: {
			[`${FeedStore}/${FeedGetters.items}`]: [],
		},
		state: {
			feed: {
				items: [],
			},
			merchant: {
				id: null,
			},
			user: {
				me: {},
			},
			squad: {
				route: { path: '/default' },
			},
		},
	};

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
				stop: jest.fn(),
				keepAlive: jest.fn(),
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
				route,
				app: {
					router: {
						push: jest.fn(),
					},
				},
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

			it('should set socket auth true on authOk', async () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};
				route.name = 'not-home';

				prefetch.mockReturnValue(Promise.resolve({}));

				mutationDispatcher(mutation, state);

				await Promise.resolve();

				expect(ctx.store.commit).toHaveBeenCalledWith('SET_SOCKET_AUTH', true);
				expect(prefetch).toHaveBeenCalledWith({
					type: 'fetchSquadders',
					store: ctx.store,
				});
			});

			it('should not dispatch socket messages while not auth', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'singleItemPost' },
				};

				mutationDispatcher(mutation, state);

				expect(ctx.store.dispatch).toHaveBeenCalledTimes(0);
			});

			it('should dispatch socket messages while auth Ok', () => {
				ctx.wsMessages = new WSMessages(ctx.store);
				state.socket.isAuth = true;
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'singleItemPost' },
				};

				mutationDispatcher(mutation, state);

				expect(ctx.store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.receiveItem}`, mutation.payload);
			});

			it('should disconnect when socket close', () => {
				location.reload = jest.fn();
				const mutation = {
					type: 'SOCKET_ONCLOSE',
					payload: { reason: 'non empty' },
				};
				Vue.prototype.$disconnect = function () {};

				spyOn(Vue.prototype, '$disconnect');

				mutationDispatcher(mutation, state);

				expect(ctx.store.commit).toHaveBeenCalledTimes(3);
				expect(ctx.store.commit).toHaveBeenCalledWith('SET_SOCKET_AUTH', false);
				expect(ctx.store.commit).toHaveBeenCalledWith('SET_PENDING', false);
				expect(ctx.store.commit).toHaveBeenCalledWith('jSocket', null);

				expect(Vue.prototype.$disconnect).toHaveBeenCalledTimes(1);
			});

			it('should fetch user', () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};

				mutationDispatcher(mutation, state);

				expect(prefetch).toHaveBeenCalledWith({
					mutation: `${UserStore}/${UserMutations.setMe}`,
					store: ctx.store,
					type: 'fetchUser',
				});
			});
		});

		describe('redirect', () => {
			beforeEach(clear);

			it('should redirect to squad route if exists on auth', async () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};

				state.squad.route.name = 'someroute';
				prefetch.mockReturnValue(Promise.resolve({}));

				mutationDispatcher(mutation, state);
				await Promise.resolve();

				expect(ctx.app.router.push).toHaveBeenCalledTimes(1);
				expect(ctx.app.router.push).toHaveBeenCalledWith(state.squad.route, expect.anything());
			});

			it('should redirect to select-username if username was not selected on auth', async () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};

				state.squad.route.name = '';
				prefetch.mockReturnValue(Promise.resolve({ nameSelected: false }));

				mutationDispatcher(mutation, state);
				await Promise.resolve();

				expect(ctx.app.router.push).toHaveBeenCalledTimes(1);
				expect(ctx.app.router.push).toHaveBeenCalledWith('/select-username', expect.anything());
			});

			it('should redirect to invite-friends if squadderCount is 0 on auth', async () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};

				state.squad.route.name = '';
				prefetch.mockReturnValue(Promise.resolve({ nameSelected: true, squadderCount: 0 }));

				mutationDispatcher(mutation, state);
				await Promise.resolve();

				expect(ctx.app.router.push).toHaveBeenCalledTimes(1);
				expect(ctx.app.router.push).toHaveBeenCalledWith('/invite-friends', expect.anything());
			});

			it('should redirect to latestPath & latestHash if they were saved in sessionStorage', async () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};
				const latestPath = '/path';
				const latestHash = 'hash';
				state.squad.route.name = '';
				prefetch.mockReturnValue(Promise.resolve({ nameSelected: true, squaddersCount: 2 }));
				isOnboarding.mockReturnValue(true);
				sessionStorage.setItem('latestPath', latestPath);
				sessionStorage.setItem('latestHash', latestHash);

				mutationDispatcher(mutation, state);
				await Promise.resolve();

				expect(ctx.app.router.push).toHaveBeenCalledTimes(1);
				expect(ctx.app.router.push).toHaveBeenCalledWith({
					path: latestPath,
					hash: latestHash,
				}, expect.anything());
			});

			it('should redirect to landing if current path is home or onboarding on auth', async () => {
				sessionStorage.clear();
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};

				state.squad.route.name = '';
				prefetch.mockReturnValue(Promise.resolve({ nameSelected: true, squaddersCount: 2 }));
				isOnboarding.mockReturnValue(true);

				mutationDispatcher(mutation, state);
				await Promise.resolve();

				expect(ctx.app.router.push).toHaveBeenCalledTimes(1);
				expect(ctx.app.router.push).toHaveBeenCalledWith(DEFAULT_LANDING, expect.anything());
			});

			it('should redirect to current path on auth', async () => {
				const mutation = {
					type: 'SOCKET_ONMESSAGE',
					payload: { type: 'authOk' },
				};

				state.squad.route.name = '';
				prefetch.mockReturnValue(Promise.resolve({ nameSelected: true, squaddersCount: 2 }));
				isOnboarding.mockReturnValue(false);
				isHome.mockReturnValue(false);

				mutationDispatcher(mutation, state);
				await Promise.resolve();

				expect(ctx.app.router.push).toHaveBeenCalledTimes(1);
				expect(ctx.app.router.push).toHaveBeenCalledWith(DEFAULT_LANDING, expect.anything());
			});

			it('should redirect to home from any on unauth', () => {
				const mutation = {
					type: 'SOCKET_ONCLOSE',
					payload: { reason: 'non empty' },
				};
				route.name = 'notHome';

				mutationDispatcher(mutation, state);

				expect(ctx.app.router.push).toHaveBeenCalledTimes(1);
				expect(ctx.app.router.push).toHaveBeenCalledWith('/');
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
