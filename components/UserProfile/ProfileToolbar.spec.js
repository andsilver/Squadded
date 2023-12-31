import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ProfileToolbar from './ProfileToolbar.vue';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';
import { merchantMockBuilder } from '~/test/merchant.mock';
import { getShortURL } from '~/services/short-url';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

jest.mock('~/services/short-url', () => ({
	getShortURL: jest.fn(),
}));

describe('User Profile Toolbar', () => {
	let wrapper;
	let user;
	let store;

	const GO_BACK_BTN = 'go-back-btn';
	const SCREEN_NAME = 'screen-name';
	const MENU = 'menu';
	const SHARE_BUTTON = 'share';
	const ADD_USER_BUTTON = 'add-user-btn';
	const SHOP_BUTTON = 'shop-btn';
	const SHARE_PROFILE_MODAL = 'share-profile-modal';

	function initLocalVue() {
		const localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		const merchant = merchantMockBuilder().get();
		store.state.merchant = merchant;
		store.state.squad = {
			API_ENDPOINT: 'any',
		};

		wrapper = shallowMount(ProfileToolbar, {
			propsData: {
				user,
			},
			store,
			localVue,
		});
	}

	it('should display correct content', () => {
		user = userMockBuilder().get();
		user.isMe = true;

		initLocalVue();

		const goBackBtn = wrapper.ref(GO_BACK_BTN);
		const screenName = wrapper.ref(SCREEN_NAME);
		const menu = wrapper.ref(MENU);
		const shareButton = wrapper.ref(SHARE_BUTTON);
		const addUserButton = wrapper.ref(ADD_USER_BUTTON);
		const shopButton = wrapper.ref(SHOP_BUTTON);

		expect(goBackBtn.exists()).toBe(false);
		expect(screenName.exists()).toBe(true);
		expect(menu.exists()).toBe(true);
		expect(shareButton.exists()).toBe(true);
		expect(addUserButton.exists()).toBe(true);
		expect(shopButton.exists()).toBe(true);
	});

	it('should not display menu if user is not me', () => {
		user = userMockBuilder().get();
		user.isMe = false;

		initLocalVue();

		const menu = wrapper.ref(MENU);
		const goBackBtn = wrapper.ref(GO_BACK_BTN);

		expect(menu.exists()).toBe(false);
		expect(goBackBtn.exists()).toBe(true);
	});

	it('should show share profile modal', () => {
		user = userMockBuilder().get();

		initLocalVue();

		const shareButton = wrapper.ref(SHARE_BUTTON);
		shareButton.trigger('click');
		const shareProfileModal = wrapper.ref(SHARE_PROFILE_MODAL);
		expect(shareProfileModal.exists()).toBe(true);
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
