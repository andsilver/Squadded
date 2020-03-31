import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ProfileTab from './ProfileTab.vue';
import Store from '~/store';
import { UserStore, UserMutations } from '~/store/user';
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

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		user = userMockBuilder().get();
		user.screenName = 'screenName';
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
		// expect(wrapper.ref(DELETE_BUTTON).exists()).toBe(true);
	});

	it('should display user as private', async () => {
		user.private = true;
		await store.commit(`${UserStore}/${UserMutations.setMe}`, user);
		expect(wrapper.ref('private-description').exists()).toBe(true);
	});
});
