import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import User from './index.vue';
import { userMockBuilder } from '~/test/user.mock';
import { UserStore, UserMutations } from '~/store/user';
import Store from '~/store';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('User component', () => {
	const FOLLOW_BTN = 'foloow-btn';

	let localVue;
	let wrapper;
	let store;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
	}

	beforeEach(initLocalVue);

	it('should resolve other user', async () => {
		expect.assertions(3);

		const user = userMockBuilder().get();
		const query = {
			id: user.userId,
		};
		const $route = {
			query,
		};
		store.commit('jSocket', {
			sendObj: jest.fn(),
		});

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

		const asyncPromise = wrapper.vm.$options.asyncData({ store, query });

		expect(store.state.socket.$ws.sendObj).toHaveBeenCalledWith({
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

	it('should not allow follow to myself', () => {
		const me = userMockBuilder().get();

		store.commit(`${UserStore}/${UserMutations.setMe}`, me);

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { query: {} },
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
				$route: { query: {
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
				$route: { query: {
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
});
