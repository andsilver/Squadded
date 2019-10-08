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

		spyOn(store, 'subscribe').and.callThrough();

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
});
