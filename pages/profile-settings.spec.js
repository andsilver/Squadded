import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ProfileSettings from './profile-settings.vue';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Profile Settings', () => {
	const TOPBAR = 'top-bar';
	const PROFILE_TAB = 'profile-tab';
	const GENERAL_TAB = 'general-tab';
	const SAVE_BUTTON = 'save-button';

	let wrapper;
	let store;
	let localVue;

	const $router = {
		push: jest.fn(),
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		wrapper = shallowMount(ProfileSettings, {
			mocks: {
				$t: msg => msg,
				$router,
				$vuetify: { breakpoint: {} },
			},
			localVue,
			store,
		});
		wrapper.vm.$root = {
			$i18n: {
				fallbackLocale: 'en',
			},
		};
	});

	it('should display content', () => {
		expect(wrapper.ref(TOPBAR).exists()).toBe(true);
		expect(wrapper.ref(PROFILE_TAB).exists()).toBe(true);
		expect(wrapper.ref(GENERAL_TAB).exists()).toBe(true);
		expect(wrapper.ref(SAVE_BUTTON).exists()).toBe(true);
	});

	it('should save profile', () => {
		store.dispatch = jest.fn();
		const saveButton = wrapper.ref(SAVE_BUTTON);
		const user = userMockBuilder().get();
		user.screenName = null;
		user.avatar = null;
		wrapper.vm.$refs.profile.user = user;
		saveButton.trigger('click');
		expect(store.dispatch).not.toHaveBeenCalled();
		user.screenName = 'Any User';
		user.avatar = 'https://avatar-image.png';
		user.language = 'fr';
		wrapper.vm.$refs.profile.user = user;
		wrapper.vm.$refs.general.user = user;
		saveButton.trigger('click');
		expect($router.push).toHaveBeenCalledWith('/me');
	});
});
