import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SelectUsername from './select-username.vue';
import { userMockBuilder } from '~/test/user.mock';
import Store from '~/store';
import { onAuth } from '~/helpers';
import { UserStore, UserMutations, UserActions } from '~/store/user';

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
	onAuth: jest.fn(),
}));

jest.mock('~/utils/compress-image', () => ({
	compressImage: jest.fn(),
}));

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Select Username', () => {
	let wrapper;
	let store;
	let localVue;
	const $router = {
		push: jest.fn(),
	};
	const me = userMockBuilder().get();
	me.isMe = true;

	const BRAND_SECTION = 'brand-section';
	const PICK_USERNAME_SEC = 'pick-username-sec';
	const AVATAR_UPLOAD_BTN = 'avatar-upload-btn';
	const USERNAME_FIELD = 'username-field';
	const SAVE_BTN = 'save-btn';
	const BROWSER_INPUT = 'browse-input';
	const CAPTURE_INPUT = 'capture-input';
	const RESIZER = 'resizer';

	beforeEach(() => {
		onAuth.mockClear();
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		wrapper = shallowMount(SelectUsername, {
			store,
			localVue,
			mocks: {
				$router,
				$t: msg => msg,
			},
		});
	});

	it('should not render if not auth', () => {
		expect(wrapper.ref(BRAND_SECTION).exists()).toBe(false);
	});

	it('should render contents after auth', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		expect(wrapper.ref(PICK_USERNAME_SEC).exists()).toBe(true);
		expect(wrapper.ref(AVATAR_UPLOAD_BTN).exists()).toBe(true);
		expect(wrapper.ref(USERNAME_FIELD).exists()).toBe(true);
		expect(wrapper.ref(SAVE_BTN).exists()).toBe(true);
		expect(wrapper.ref(BROWSER_INPUT).exists()).toBe(true);
		expect(wrapper.ref(CAPTURE_INPUT).exists()).toBe(true);
		expect(wrapper.ref(RESIZER).exists()).toBe(true);
	});

	it('should save username and avatar', async () => {
		await store.commit('SET_SOCKET_AUTH', true);
		store.dispatch = jest.fn();
		expect(wrapper.ref(SAVE_BTN).exists()).toBe(true);
		wrapper.ref(SAVE_BTN).trigger('click');
		await Promise.resolve();
		expect(store.dispatch).toHaveBeenCalledWith(`${UserStore}/${UserActions.setProfile}`, {
			...me,
			nameSelected: true,
		});
		expect($router.push).toHaveBeenCalledWith('/create-your-squad');
	});
});
