import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import BackBar from './BackBar.vue';
import Store from '~/store';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
}));

describe('Subscribers BackBar', () => {
	let wrapper;
	let store;
	let me;
	let other;
	let localVue;
	let $route = {
		path: '/my',
	};

	const GOBACKBTN = 'go-back-btn';
	const USERNAME = 'username';
	const ADD_FRIENDS_BTN = 'add-friends-btn';

	const initLocalVue = () => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		me = userMockBuilder().get();
		other = userMockBuilder().get();
		store.state.user.me = me;
		store.state.user.other = other;
		wrapper = shallowMount(BackBar, {
			localVue,
			store,
			mocks: {
				$t: msg => msg,
				$route,
			},
		});
	};

	it('should display correct contents', () => {
		initLocalVue();
		expect(wrapper.ref(GOBACKBTN).exists()).toBe(true);
		expect(wrapper.ref(USERNAME).exists()).toBe(true);
		wrapper.setProps({ isMe: true });
		expect(wrapper.ref(ADD_FRIENDS_BTN).exists()).toBe(true);
	});

	it('should display my username if path includes /my', () => {
		initLocalVue();
		expect(wrapper.ref(USERNAME).text()).toBe('My Squad');
	});

	it('should display my username if path not includes /my', () => {
		const id = 'anyid';
		$route = {
			path: '',
			params: { id },
		};
		initLocalVue();
		expect(prefetch).toHaveBeenCalledWith({
			guid: id,
			mutation: `${UserStore}/${UserMutations.setOther}`,
			store,
			type: 'fetchUser',
		});
		expect(wrapper.ref(USERNAME).text()).toBe('My Squad');
	});
});
