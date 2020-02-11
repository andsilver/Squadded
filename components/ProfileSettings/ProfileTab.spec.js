import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ProfileTab from './ProfileTab.vue';
import Store from '~/store';
import { UserStore, UserActions, UserMutations } from '~/store/user';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Profile Settings Topbar', () => {
	let wrapper;
	let store;
	let localVue;
	let user;
	const $router = {
		push: jest.fn(),
	};

	const NAME_FIELD = 'name-field';
	const BIO_FIELD = 'bio-field';
	const INSTAGRAM_USER_FIELD = 'instagram-username-field';
	const TOGGLE_PRIVATE = 'toggle-private';
	const SAVE_BUTTON = 'save-button';
	// const DELETE_BUTTON = 'delete-button';

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		user = userMockBuilder().get();
		wrapper = shallowMount(ProfileTab, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
	});

	it('should display content', () => {
		expect(wrapper.ref(NAME_FIELD).exists()).toBe(true);
		expect(wrapper.ref(BIO_FIELD).exists()).toBe(true);
		expect(wrapper.ref(INSTAGRAM_USER_FIELD).exists()).toBe(true);
		expect(wrapper.ref(TOGGLE_PRIVATE).exists()).toBe(true);
		expect(wrapper.ref(SAVE_BUTTON).exists()).toBe(true);
		// expect(wrapper.ref(DELETE_BUTTON).exists()).toBe(true);
	});

	it('should display user as private', async () => {
		user.private = true;
		await store.commit(`${UserStore}/${UserMutations.setMe}`, user);
		expect(wrapper.ref('private-description').exists()).toBe(true);
	});

	it('should toggle user private', async () => {
		user.private = false;
		await store.commit(`${UserStore}/${UserMutations.setMe}`, user);
		expect(wrapper.ref('private-description').exists()).toBe(false);
		// const toggleButton = wrapper.ref(TOGGLE_PRIVATE);
		// toggleButton.trigger('click');
		// expect(wrapper.ref('private-description').exists()).toBe(true);
	});

	it('should save profile on save button click', async () => {
		const saveButton = wrapper.ref(SAVE_BUTTON);
		user.bio = 'testbio';
		user.private = true;
		user.isMe = true;
		store.dispatch = jest.fn();
		await store.commit(`${UserStore}/${UserMutations.setMe}`, user);
		saveButton.trigger('click');
		expect(store.dispatch).toHaveBeenCalledWith(`${UserStore}/${UserActions.setProfile}`, user);
	});

	it('should go back or profile page on save', async () => {
		await store.commit(`${UserStore}/${UserMutations.setMe}`, user);
		Object.defineProperty(global.history, 'length', {
			get: jest.fn().mockReturnValueOnce(5).mockReturnValue(0),
		});
		history.back = jest.fn();
		await wrapper.vm.saveProfile();
		expect(history.back).toHaveBeenCalled();
		await wrapper.vm.saveProfile();
		expect($router.push).toHaveBeenCalledWith('/me');
	});
});
