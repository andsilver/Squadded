import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Squadders from './index.vue';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';
import { getShortURL } from '~/services/short-url';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

jest.mock('~/services/short-url', () => ({
	getShortURL: jest.fn(),
}));

describe('Squadders', () => {
	const COUNT_SQUADDERS = 'count-squadders';
	const PLUS_BTN = 'plus-btn';

	let wrapper;
	let store;
	let user;
	let localVue;

	const initWrapper = () => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		user = userMockBuilder().get();
		store.state.user.me = user;
		wrapper = shallowMount(Squadders, {
			store,
			localVue,
			props: {
				users: [],
			},
			mocks: {
				$t: msg => msg,
			},
		});
	};

	const mockSquadders = (lessThan5 = false) => {
		return new Array(lessThan5 ? 4 : 10).fill(userMockBuilder().short());
	};

	beforeEach(() => {
		initWrapper();
	});

	it('should display correct number', () => {
		const squadders = mockSquadders();
		wrapper.setProps({ users: squadders });
		const count = wrapper.ref(COUNT_SQUADDERS);
		expect(count.text()).toBe(`+${squadders.length - 5}`);
	});

	it('should display only 5 people when over 5', () => {
		const squadders = mockSquadders();
		wrapper.setProps({ users: squadders });
		const users = wrapper.findAll('.user-avatar-container');
		expect(users.length).toBe(5);
	});

	it('should display correct people when number of users is less than 5', () => {
		const squadders = mockSquadders(true);
		wrapper.setProps({ users: squadders });
		const users = wrapper.findAll('.user-avatar-container');
		expect(users.length).toBe(squadders.length);
	});

	it('should display plus button', () => {
		const squadders = mockSquadders();
		wrapper.setProps({ users: squadders });
		expect(wrapper.ref(PLUS_BTN).exists()).toBe(true);
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
