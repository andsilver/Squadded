import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SelectUsername from './select-username.vue';
import { userMockBuilder } from '~/test/user.mock';
import Store from '~/store';
import { PostStore, PostMutations } from '~/store/post';
import { prefetch, onAuth } from '~/helpers';
import { UserStore, UserMutations, UserActions } from '~/store/user';

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
	onAuth: jest.fn(),
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

	const BRAND_SECTION = 'brand-section';
	const PICK_USERNAME_SEC = 'pick-username-sec';
	const USER_AVATAR = 'user-avatar';
	const AVATAR_INPUT = 'avatar-input';
	const AVATAR_UPLOAD_BTN = 'avatar-upload-btn';
	const USERNAME_FIELD = 'username-field';
	const SAVE_BTN = 'save-btn';

	beforeEach(() => {
		onAuth.mockClear();
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
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
		await store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		await store.commit('SET_SOCKET_AUTH', true);
		expect(wrapper.ref(BRAND_SECTION).exists()).toBe(true);
		expect(wrapper.ref(PICK_USERNAME_SEC).exists()).toBe(true);
		expect(wrapper.ref(USER_AVATAR).exists()).toBe(true);
		expect(wrapper.ref(AVATAR_INPUT).exists()).toBe(true);
		expect(wrapper.ref(AVATAR_UPLOAD_BTN).exists()).toBe(true);
		expect(wrapper.ref(USERNAME_FIELD).exists()).toBe(true);
		expect(wrapper.ref(SAVE_BTN).exists()).toBe(true);
	});

	it('should save avatar', async () => {
		const url = 'https://example.com/avatar.png';
		await store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		await store.commit('SET_SOCKET_AUTH', true);
		prefetch.mockReturnValue(Promise.resolve(url));
		global.fetch = jest.fn().mockReturnValue(Promise.resolve({ ok: true }));
		const img = new URL(url);
		const file = { type: 'image' };
		wrapper.vm.file = file;
		wrapper.vm.saveAvatar();
		await Promise.resolve();
		expect(prefetch).toHaveBeenCalledWith({
			contentType: file.type,
			mutation: `${PostStore}/${PostMutations.uploadURL}`,
			store,
			type: 'getUploadUrl',
		});
		await Promise.resolve();
		expect(fetch).toHaveBeenCalledWith(url, {
			method: 'PUT',
			body: file,
		});
		expect(wrapper.vm.user.avatar).toBe(img.href);
	});

	it('should save username and avatar', async () => {
		store.dispatch = jest.fn();
		me.isMe = true;
		await store.commit(`${UserStore}/${UserMutations.setMe}`, me);
		await store.commit('SET_SOCKET_AUTH', true);
		await wrapper.ref(SAVE_BTN).trigger('click');
		expect(store.dispatch).toHaveBeenCalledWith(`${UserStore}/${UserActions.setProfile}`, { ...me, nameSelected: true });
		expect($router.push).toHaveBeenCalledWith('/create-your-squad');
	});
});
