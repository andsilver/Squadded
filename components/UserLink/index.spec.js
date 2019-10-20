import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import UserLink from './index.vue';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';
import { UserStore, UserMutations } from '~/store/user';

describe('User link', () => {
	let localVue;
	let wrapper;
	let store;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);

		window.moment = jest.fn();
		window.moment.locale = jest.fn();
	}

	beforeEach(initLocalVue);

	it('should link to user\'s own profile', () => {
		const me = userMockBuilder();

		wrapper = shallowMount(UserLink, {
			localVue,
			propsData: { user: me.short() },
			store,
			mocks: {
				_i18n: {
					locale: 'en',
				},
			},
		});
		store.commit(`${UserStore}/${UserMutations.setMe}`, me.get());

		/*
			Regular wrapper api methods with find() do not work
			props() returns nothing
			atributes() returns [object Object]
		*/
		const userLink = wrapper.vm.$children[0];
		expect(userLink.$attrs.to).toEqual({
			name: 'me',
		});
	});

	it('should link to post user\'s profile', () => {
		const me = userMockBuilder().get();
		const user = userMockBuilder().short();

		wrapper = shallowMount(UserLink, {
			localVue,
			propsData: { user },
			store,
			mocks: {
				_i18n: {
					locale: 'en',
				},
			},
		});
		store.commit(`${UserStore}/${UserMutations.setMe}`, me);

		const userLink = wrapper.vm.$children[0];
		expect(userLink.$attrs.to).toEqual({
			name: 'user',
			query: {
				id: user.userId,
			},
		});
	});
});
