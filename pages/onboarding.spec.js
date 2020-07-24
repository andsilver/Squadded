import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Onboarding from './onboarding.vue';
import Store from '~/store';
import { OnboardingStore, OnboardingMutations } from '~/store/onboarding';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Onboarding', () => {
	const ONBOARDING = 'onboarding';
	const ONBOARDING_NAV = 'onboarding-nav';
	const SIGNIN_BTN = 'signin-btn';
	const SKIP_BTN = 'skip-btn';

	let wrapper;
	let store;
	let localVue;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.commit(`${OnboardingStore}/${OnboardingMutations.setVideos}`, 'https://example-video.com');
		wrapper = shallowMount(Onboarding, {
			store,
			localVue,
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
