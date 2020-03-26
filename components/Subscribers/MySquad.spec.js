import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MySquad from './MySquad.vue';
import { prefetch } from '~/helpers';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';
import UserLink from '~/components/UserLink';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
}));

describe('MySquad component', () => {
	let localVue;
	let wrapper;
	let store;
	const squadders = new Array(10).fill(userMockBuilder().get());

	const SEARCH_PLUS = 'search-plus';
	const $ws = {
		sendObj: jest.fn(),
	};

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.state.feed.squadders = squadders;
		wrapper = shallowMount(MySquad, {
			localVue,
			store,
			mocks: {
				$t: msg => msg,
				$ws,
			},
		});
	}

	beforeEach(initLocalVue);

	it('should display correct contents', async () => {
		initLocalVue();
		await Promise.resolve();
		const searchPlus = wrapper.ref(SEARCH_PLUS);
		const users = wrapper.findAll(UserLink);
		expect(searchPlus.exists()).toBe(true);
		expect(users.length).toBe(10);
		expect(wrapper.ref('add-friends-dialog').exists()).toBe(true);
	});

	it('should send fetchSquadders message', () => {
		expect(prefetch).toHaveBeenCalledWith({
			type: 'fetchSquadders',
			store: store,
		});
	});

	it('should filter users', () => {
		const searchText = 'testusername';
		squadders[0].screenName = searchText;
		store.state.feed.squadders = squadders;
		initLocalVue();
		expect(wrapper.vm.filtered[0].screenName).toBe(searchText);
	});
});
