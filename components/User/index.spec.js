import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import User from './index.vue';
import { flushPromises } from '~/helpers';
import { FeedStore, FeedMutations } from '~/store/feed';
import { UserStore, UserMutations } from '~/store/user';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('User component', () => {
	const FOLLOW_BTN = 'follow-btn';

	let localVue;
	let wrapper;
	let store;
	let $ws;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
		$ws = {
			sendObj: jest.fn(),
		};
		store.commit('jSocket', $ws);
	}

	beforeEach(initLocalVue);

	it('should resolve other user', async () => {
		expect.assertions(3);

		const user = userMockBuilder().get();
		const params = {
			id: user.userId,
		};
		const $route = {
			params,
		};

		store.commit('SET_SOCKET_AUTH', true);

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route,
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});

		const asyncPromise = wrapper.vm.$options.asyncData({ store, params });
		await flushPromises();

		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'fetchUser',
			guid: user.userId,
		});

		store.commit(`${UserStore}/${UserMutations.setOther}`, user);

		await asyncPromise.then((data) => {
			wrapper.setData(data);
			expect(wrapper.vm.other).toEqual(user);
			expect(wrapper.vm.user).toEqual(user);
		});
	});

	it('should redirect myself to /me', () => {
		const me = userMockBuilder().get();

		store.commit(`${UserStore}/${UserMutations.setMe}`, me);

		const params = {
			id: me.userId,
		};
		const redirect = jest.fn();
		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});

		wrapper.vm.$options.asyncData({ store, params, redirect });

		expect(redirect).toHaveBeenCalledWith('/me');
	});

	it('should not allow follow to myself', () => {
		const me = userMockBuilder().get();

		store.commit(`${UserStore}/${UserMutations.setMe}`, me);

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params: {} },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});

		expect(wrapper.ref(FOLLOW_BTN).exists()).toBe(false);
	});

	it('should allow to follow if not follower yet', () => {
		const me = userMockBuilder().get();
		const user = userMockBuilder().get();
		user.followers.me = false;

		store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		store.commit(`${UserStore}/${UserMutations.setOther}`, user);

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params: {
					id: user.userId,
				} },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});

		wrapper.setData({ other: user });

		const followBtn = wrapper.ref(FOLLOW_BTN);
		expect(followBtn.exists()).toBe(true);
		expect(followBtn.text()).toBe('user.Follow');
	});

	it('should allow to unfollow if already a follower', () => {
		const me = userMockBuilder().get();
		const user = userMockBuilder().get();
		user.followers.me = true;

		store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		store.commit(`${UserStore}/${UserMutations.setOther}`, user);

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params: {
					id: user.userId,
				} },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});

		wrapper.setData({ other: user });

		const followBtn = wrapper.ref(FOLLOW_BTN);
		expect(followBtn.exists()).toBe(true);
		expect(followBtn.text()).toBe('user.Unfollow');
	});

	it('should not follow myself', () => {
		const me = userMockBuilder().get();

		store.commit(`${UserStore}/${UserMutations.setMe}`, me);

		const $ws = {
			sendObj: jest.fn(),
		};

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params: {} },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
				$ws,
			},
		});

		wrapper.vm.toggleFollow();
		expect($ws.sendObj).not.toHaveBeenCalled();
	});

	it('should follow other user', () => {
		const me = userMockBuilder().get();
		const user = userMockBuilder().get();
		user.followers.me = false;

		store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		store.commit(`${UserStore}/${UserMutations.setOther}`, user);

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params: {
					id: user.userId,
				} },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
				$ws,
			},
		});

		wrapper.setData({ other: user });

		spyOn(store, 'commit').and.callThrough();

		wrapper.vm.toggleFollow();
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'follow',
			guid: user.userId,
			follow: true,
		});
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.clear}`);
		expect(user.followers.me).toBe(true);
	});

	it('should unfollow other user', () => {
		const me = userMockBuilder().get();
		const user = userMockBuilder().get();
		user.followers.me = true;

		store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		store.commit(`${UserStore}/${UserMutations.setOther}`, user);

		const $ws = {
			sendObj: jest.fn(),
		};

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params: {
					id: user.userId,
				} },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
				$ws,
			},
		});

		wrapper.setData({ other: user });

		wrapper.vm.toggleFollow();
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'follow',
			guid: user.userId,
			follow: false,
		});
		expect(user.followers.me).toBe(false);
	});
});
