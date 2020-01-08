import { Wrapper, shallowMount } from '@vue/test-utils';
import Topbar from './Topbar.vue';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Profile Settings Topbar', () => {
	let wrapper;

	const GO_BACK_BTN = 'go-back-btn';
	const PROFILE_SETTINGS_TITLE = 'profile-settings-title';

	beforeEach(() => {
		history.back = jest.fn();
		wrapper = shallowMount(Topbar, {
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should display content', () => {
		const goBackBtn = wrapper.ref(GO_BACK_BTN);
		const pairedItemTitle = wrapper.ref(PROFILE_SETTINGS_TITLE);
		expect(goBackBtn.exists()).toBe(true);
		expect(pairedItemTitle.exists()).toBe(true);
	});
});
