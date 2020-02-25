import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import User from './index.vue';
import { flushPromises } from '~/helpers';
import { UserStore, UserMutations } from '~/store/user';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';
import { fetchUser } from '~/services/user';
import { USER_TOKEN_KEY } from '~/consts/keys';

jest.mock('~/services/user', () => ({
	fetchUser: jest.fn(),
}));

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('User component', () => {
	let localVue;
	let wrapper;
	let store;
	let $ws;
	let query = {};

	function initLocalVue () {
		document.getElementById = jest.fn(() => document.createElement('div'));
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
		$ws = {
			sendObj: jest.fn(),
		};
		store.commit('jSocket', $ws);
		localStorage.clear();
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
			query,
		};

		localStorage.setItem(USER_TOKEN_KEY, 'token');
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

	it('should call fetchUser rest api if not authenticated', async () => {
		const user = userMockBuilder().get();
		const params = {
			id: user.userId,
		};
		const $route = {
			params,
			query,
		};
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
		fetchUser.mockReturnValue(Promise.resolve({ user }));
		const asyncPromise = wrapper.vm.$options.asyncData({ store, params });
		await flushPromises();
		await asyncPromise.then(() => {
			expect(fetchUser).toHaveBeenCalledWith(user.userId);
			expect(wrapper.vm.other).toEqual(user);
		});
	});

	it('should redirect myself to /me', () => {
		const me = userMockBuilder().get();
		localStorage.setItem(USER_TOKEN_KEY, 'token');
		store.commit('SET_SOCKET_AUTH', true);
		store.commit(`${UserStore}/${UserMutations.setMe}`, me);

		const params = {
			id: me.userId,
		};
		const redirect = jest.fn();
		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params, query },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});

		wrapper.vm.$options.asyncData({ store, params, redirect });

		expect(redirect).toHaveBeenCalledWith('/me');
	});

	it('should show invitation section if invite is passed in query', () => {
		const user = userMockBuilder().get();
		const params = { id: user.userId };
		query = { invite: true };

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params, query },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});

		store.state.user.other = user;
		wrapper.vm.userId = user.userId;

		const invitation = wrapper.ref('invitation');
		expect(invitation.exists()).toBe(true);
	});

	it('should not show invitation if he is in your squad', () => {
		const user = userMockBuilder().get();
		const params = { id: user.userId };
		const query = { invite: true };
		user.squad = { exists: true, pending: false };

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params, query },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});

		store.state.user.other = user;
		wrapper.vm.userId = user.userId;

		expect(wrapper.ref('invitation').exists()).toBe(false);
		expect(wrapper.ref('my-squad').exists()).toBe(true);
	});

	it('should show invitation if he accepted your invite', () => {
		const user = userMockBuilder().get();
		const params = { id: user.userId };
		const query = { invite: true };
		user.squad = { exists: true, pending: true, invitee: true };

		wrapper = shallowMount(User, {
			localVue,
			store,
			mocks: {
				$route: { params, query },
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});

		store.state.user.other = user;
		wrapper.vm.userId = user.userId;

		const invitation = wrapper.ref('invitation');
		expect(invitation.exists()).toBe(true);
	});
});
