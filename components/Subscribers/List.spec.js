import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import List from './List.vue';
import { prefetch } from '~/helpers';
import { UserStore, UserMutations } from '~/store/user';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
}));

describe('List component', () => {
	let localVue;
	let wrapper;
	let store;
	let user;
	let params;
	let $route;

	const SEARCH_PLUS = 'search-plus';
	const USER_LIST = 'user-list';

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		user = userMockBuilder().get();
		params = {
			id: user.userId,
		};
		$route = {
			params,
		};
		prefetch.mockReturnValue(Promise.resolve());
		store.state.user.other = user;
		wrapper = shallowMount(List, {
			localVue,
			store,
			mocks: {
				$route,
				$t: msg => msg,
			},
		});
	}

	beforeEach(initLocalVue);

	it('should display correct contents', () => {
		store.state.user.userList = new Array(10).fill(userMockBuilder().get());
		const searchPlus = wrapper.ref(SEARCH_PLUS);
		const userList = wrapper.ref(USER_LIST);
		expect(searchPlus.exists()).toBe(true);
		expect(userList.exists()).toBe(true);
	});

	it('should send fetchUser message', () => {
		expect(prefetch).toHaveBeenCalledWith({
			guid: $route.params.id,
			mutation: `${UserStore}/${UserMutations.setOther}`,
			store,
			type: 'fetchUser',
		});
	});

	it('should filter users', () => {
		const searchText = 'testusername';
		const users = new Array(10).fill(userMockBuilder().get());
		users[0].name = searchText;
		initLocalVue();
		wrapper.setData({ searchText, users });
		expect(wrapper.vm.filtered[0].name).toBe(searchText);
	});
});
