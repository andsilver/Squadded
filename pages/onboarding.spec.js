import { Wrapper, shallowMount } from '@vue/test-utils';
import Onboarding from './onboarding.vue';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Onboarding', () => {
	const ONBOARDING = 'onboarding';
	const ONBOARDING_NAV = 'onboarding-nav';
	const SIGNIN_BTN = 'signin-btn';
	const SKIP_BTN = 'skip-btn';

	let wrapper;

	beforeEach(() => {
		wrapper = shallowMount(Onboarding, {
			mocks: {
				$t: msg => msg,
				$anime: {
					timeline: jest.fn().mockReturnValue({
						add: jest.fn(),
					}),
				},
			},
		});
	});

	it('should display content', () => {
		expect(wrapper.ref(ONBOARDING).exists()).toBe(true);
		expect(wrapper.ref(ONBOARDING_NAV).exists()).toBe(true);
		expect(wrapper.ref(SIGNIN_BTN).exists()).toBe(true);
		expect(wrapper.ref(SKIP_BTN).exists()).toBe(true);
	});
});
