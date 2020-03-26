import { shallowMount, Wrapper } from '@vue/test-utils';
import PopMenu from './PopMenu.vue';
import { userMockBuilder } from '~/test/user.mock';
import { getShortURL } from '~/services/short-url';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

jest.mock('~/services/short-url', () => ({
	getShortURL: jest.fn(),
}));

describe('UserProfile - PopMenu', () => {
	let wrapper;
	let user;

	const $ws = {
		sendObj: jest.fn(),
	};
	const $store = {
		state: {
			merchant: {
				siteUrl: 'siteUrl',
				siteTitle: 'siteTitle',
			},
			squad: {
				API_ENDPOINT: 'apiendpoint',
			},
		},
	};

	beforeEach(() => {
		user = userMockBuilder().get();
		wrapper = shallowMount(PopMenu, {
			mocks: {
				$t: msg => msg,
				$ws,
				$store,
			},
			propsData: {
				user,
			},
		});
	});

	it('should render correct elements', () => {
		user = userMockBuilder().get();
		user.squad = {
			exists: false,
			pending: false,
			invitee: false,
		};
		user.followers.me = false;
		wrapper.setProps({
			user,
		});
		expect(wrapper.ref('report').exists()).toBe(true);
		expect(wrapper.ref('add-to-squad').exists()).toBe(true);
		expect(wrapper.ref('remove-squad').exists()).toBe(false);
		expect(wrapper.ref('share').exists()).toBe(true);
		expect(wrapper.ref('remove').exists()).toBe(true);
	});

	it('should not render add-to-squad if he is my squad', () => {
		user = userMockBuilder().get();
		user.squad = {
			exists: true,
			pending: false,
			invitee: false,
		};
		wrapper.setProps({
			user,
		});
		expect(wrapper.ref('add-to-squad').exists()).toBe(false);
		expect(wrapper.ref('remove-squad').exists()).toBe(true);
	});

	it('should render share link dialog on click share', async () => {
		const url = 'url';
		getShortURL.mockReturnValue(Promise.resolve(url));
		wrapper.ref('share').trigger('click');
		expect(getShortURL).toHaveBeenCalledWith(wrapper.vm.userLink, $store);
		expect(wrapper.ref('share-dialog').exists()).toBe(true);
		global.navigator.share = jest.fn().mockReturnValue(Promise.resolve());
		wrapper.vm.shortURL = url;
		wrapper.ref('share').trigger('click');
		await Promise.resolve();
		const { siteTitle } = $store.state.merchant;
		const title = `${user.name || user.screenName} @ ${siteTitle}`;
		expect(navigator.share).toHaveBeenCalledWith({
			title,
			text: title,
			url,
		});
	});
});
