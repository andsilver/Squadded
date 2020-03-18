import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MySquad from './MySquad.vue';
import { prefetch } from '~/helpers';
import Store from '~/store';
import { FeedStore, FeedMutations } from '~/store/feed';
import { userMockBuilder } from '~/test/user.mock';
import { getShortURL } from '~/services/short-url';
import UserLink from '~/components/UserLink';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
}));

jest.mock('~/services/short-url', () => ({
	getShortURL: jest.fn(),
}));

describe('MySquad component', () => {
	let localVue;
	let wrapper;
	let store;
	let user;
	let squadders;

	const SEARCH_PLUS = 'search-plus';
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

	it('should render share link dialog on click share', async () => {
		const url = 'url';
		getShortURL.mockReturnValue(Promise.resolve(url));
		wrapper.ref('share').trigger('click');
		expect(getShortURL).toHaveBeenCalledWith(wrapper.vm.userLink, store);
		expect(wrapper.ref('share-profile-modal').exists()).toBe(true);
		global.navigator.share = jest.fn().mockReturnValue(Promise.resolve());
		wrapper.vm.shortURL = url;
		wrapper.ref('share').trigger('click');
		await Promise.resolve();
		const { siteTitle } = store.state.merchant;
		const title = `${user.name || user.screenName} @ ${siteTitle}`;
		expect(navigator.share).toHaveBeenCalledWith({
			title,
			text: title,
			url,
		});
	});
});
