import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import UserLink from './index.vue';
import Store from '~/store';
import { userMockBuilder } from '~/test/user.mock';
import { UserStore, UserMutations } from '~/store/user';
import { HomeStore, HomeMutations } from '~/store/home';
import { FeedStore, FeedMutations } from '~/store/feed';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('User link', () => {
	let localVue;
	let wrapper;
	let store;

	const WATCH_ICON = 'watch-icon';
	const WATCHING_ICON = 'watching-icon';
	const WATCH_BTN = 'watch-btn';
	const WATCH_TEXT = 'watch-text';
	const WATCHING_TEXT = 'watching-text';

	const $route = {
		name: '',
	};
	const $ws = {
		sendObj: jest.fn(),
	};

	const mocks = {
		_i18n: {
			locale: 'en',
		},
		$t: msg => msg,
		$route,
		$ws,
	};

	function initLocalVue() {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);

		window.moment = jest.fn();
		window.moment.locale = jest.fn();
	}

	beforeEach(initLocalVue);

	it("should link to user's own profile", () => {
		const me = userMockBuilder();

		wrapper = shallowMount(UserLink, {
			localVue,
			propsData: { user: me.short() },
			store,
			mocks,
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

	it("should link to post user's profile", () => {
		const me = userMockBuilder().get();
		const user = userMockBuilder().short();

		wrapper = shallowMount(UserLink, {
			localVue,
			propsData: { user },
			store,
			mocks,
		});
		store.commit(`${UserStore}/${UserMutations.setMe}`, me);

		const userLink = wrapper.vm.$children[0];
		expect(userLink.$attrs.to).toEqual({
			name: 'user-id',
			params: {
				id: user.userId,
			},
		});
	});

	it('should show popover', () => {
		const user = userMockBuilder().short();
		user.showPopover = true;
		wrapper = shallowMount(UserLink, {
			localVue,
			propsData: { user },
			store,
			mocks,
		});
		expect(wrapper.ref('popover').exists()).toBe(true);
	});

	it('should not show watch button if the user is in my squad', () => {
		const user = userMockBuilder().short();
		user.mysquad = true;
		wrapper = shallowMount(UserLink, {
			localVue,
			propsData: { user },
			store,
			mocks,
		});
		expect(wrapper.ref(WATCH_BTN).exists()).toBe(false);
	});

	it('should not show watch button if the path is not /all', () => {
		const user = userMockBuilder().short();
		user.mysquad = false;
		$route.name = 'not-all';
		wrapper = shallowMount(UserLink, {
			localVue,
			propsData: { user },
			store,
			mocks,
		});
		expect(wrapper.ref(WATCH_BTN).exists()).toBe(false);
	});

	it('should show watch button i am not following the user', () => {
		const user = userMockBuilder().short();
		user.mysquad = false;
		user.followed = false;
		$route.name = 'all';
		wrapper = shallowMount(UserLink, {
			localVue,
			propsData: { user },
			store,
			mocks,
		});
		expect(wrapper.ref(WATCH_BTN).exists()).toBe(true);
		expect(wrapper.ref(WATCH_TEXT).exists()).toBe(true);
		expect(wrapper.ref(WATCH_ICON).exists()).toBe(true);
	});

	it('should show watching button if i am following the user', () => {
		const user = userMockBuilder().short();
		user.mysquad = false;
		user.followed = true;
		$route.name = 'all';
		wrapper = shallowMount(UserLink, {
			localVue,
			propsData: { user },
			store,
			mocks,
		});
		expect(wrapper.ref(WATCH_BTN).exists()).toBe(true);
		expect(wrapper.ref(WATCHING_TEXT).exists()).toBe(true);
		expect(wrapper.ref(WATCHING_ICON).exists()).toBe(true);
	});

	it('should toggle following', () => {
		const user = userMockBuilder().short();
		user.mysquad = false;
		user.followed = false;
		$route.name = 'all';
		wrapper = shallowMount(UserLink, {
			localVue,
			propsData: { user },
			store,
			mocks,
		});
		store.commit = jest.fn();
		wrapper.ref(WATCH_BTN).trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'follow',
			guid: user.guid,
			follow: true,
		});
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.clear}`);
		expect(store.commit).toHaveBeenCalledWith(`${UserStore}/${UserMutations.setFollow}`, { follow: true, user });
		expect(store.commit).toHaveBeenCalledWith(`${HomeStore}/${HomeMutations.follow}`, user);
	});
});
