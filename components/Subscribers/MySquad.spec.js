import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MySquad from './MySquad.vue';
import { prefetch } from '~/helpers';
import Store from '~/store';
import { FeedStore, FeedMutations } from '~/store/feed';
import { UserStore, UserActions } from '~/store/user';
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
	let user;
	let squadders;

	const SEARCH_PLUS = 'search-plus';
	const REMOVING_SQUADDER = 'removing-squadder';
	const SQUADDER_AVATAR = 'squadder-avatar';
	const TITLE = 'title';
	const CLOSE_BTN = 'close-btn';
	const DESCRIPTION = 'description';
	const REMOVE_BTN = 'remove-btn';
	const CANCEL_BTN = 'cancel-btn';
	const $ws = {
		sendObj: jest.fn(),
	};

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		user = userMockBuilder().get();
		squadders = new Array(10).fill(userMockBuilder().get());
		store.state.user.me = user;
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
		prefetch.mockReturnValue(Promise.resolve(squadders));
		initLocalVue();
		await Promise.resolve();
		const searchPlus = wrapper.ref(SEARCH_PLUS);
		const users = wrapper.findAll(UserLink);
		expect(searchPlus.exists()).toBe(true);
		expect(users.length).toBe(10);
	});

	it('should send fetchSquadders message', () => {
		expect(prefetch).toHaveBeenCalledWith({
			type: 'fetchSquadders',
			store: store,
			mutation: `${FeedStore}/${FeedMutations.receiveSquadders}`,
		});
	});

	it('should filter users', async () => {
		const searchText = 'testusername';
		squadders[0].screenName = searchText;
		prefetch.mockReturnValue(Promise.resolve(squadders));
		initLocalVue();
		await Promise.resolve();
		expect(wrapper.vm.filtered[0].screenName).toBe(searchText);
	});

	it('should show removing squadder dialog', async () => {
		prefetch.mockReturnValue(Promise.resolve(squadders));
		initLocalVue();
		await Promise.resolve();
		const squadder = squadders[0];
		wrapper.vm.removeSquad(squadder);
		expect(wrapper.vm.showSquadderRemoveDialog).toBe(true);
		expect(wrapper.vm.removingSquadder).toEqual(squadder);
		expect(wrapper.ref(REMOVING_SQUADDER).exists()).toBe(true);
		expect(wrapper.ref(SQUADDER_AVATAR).exists()).toBe(true);
		expect(wrapper.ref(TITLE).exists()).toBe(true);
		expect(wrapper.ref(CLOSE_BTN).exists()).toBe(true);
		expect(wrapper.ref(DESCRIPTION).exists()).toBe(true);
		expect(wrapper.ref(REMOVE_BTN).exists()).toBe(true);
		expect(wrapper.ref(CANCEL_BTN).exists()).toBe(true);
	});

	it('should remove squadder', async () => {
		user.squaddersCount = 2;
		prefetch.mockReturnValue(Promise.resolve(squadders));
		initLocalVue();
		store.dispatch = jest.fn();
		await Promise.resolve();
		const squadder = squadders[0];
		await wrapper.vm.removeSquad(squadder);
		await wrapper.ref(REMOVE_BTN).trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'removeSquadder',
			guid: squadder.userId,
		});
		expect(store.dispatch).toHaveBeenCalledWith(`${UserStore}/${UserActions.setProfile}`, user);
	});
});
