import { Wrapper, shallowMount } from '@vue/test-utils';
import ProfileSettings from './profile-settings.vue';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Profile Settings', () => {
	const TOPBAR = 'top-bar';
	const PROFILE_TAB = 'profile-tab';
	const GENERAL_TAB = 'general-tab';

	let wrapper;

	beforeEach(() => {
		wrapper = shallowMount(ProfileSettings, {
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should display content', () => {
		expect(wrapper.ref(TOPBAR).exists()).toBe(true);
		expect(wrapper.ref(PROFILE_TAB).exists()).toBe(true);
		expect(wrapper.ref(GENERAL_TAB).exists()).toBe(true);
	});
});
