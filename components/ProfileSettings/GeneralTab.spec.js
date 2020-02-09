import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import GeneralTab from './GeneralTab.vue';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Profile Settings Topbar', () => {
	let wrapper;
	let store;
    let localVue;
	const $router = {
		push: jest.fn(),
    };
    
    const SIGN_OUT_BUTTON = 'sign-out-button';

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		wrapper = shallowMount(GeneralTab, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
	});

	it('should have cleared the sessionStorage and localStorage', () => {
		const signOutButton = wrapper.ref(SIGN_OUT_BUTTON);
        signOutButton.trigger('click');
        expect(sessionStorage.length).toBe(0);
        expect(localStorage.length).toBe(0);
	});
});