import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Default from './default.vue';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Message Input', () => {
	const MAIN = 'main-content';
	const PRELOADER = 'preloader';
	const TAB_BAR = 'tab-bar';

	let localVue;
	let store;
	let wrapper;
	let $route;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		$route = {
			name: 'index',
			path: '/',
		};

		store = new Vuex.Store({
			state: {
				socket: {
					isPendingAuth: true,
					isAuth: false,
				},
			},
		});

		wrapper = shallowMount(Default, {
			store,
			localVue,
			mocks: {
				$route,
			},
		});
	});

	it('should not display tabs at home', () => {
		const tabs = wrapper.ref(TAB_BAR);
		expect(tabs.exists()).toBe(false);
	});

	it('should display tabs for logged in user', () => {
		store.state.socket.isAuth = true;
		const tabs = wrapper.ref(TAB_BAR);
		expect(tabs.exists()).toBe(true);
	});

	it('should display preloader spinner while pending auth', () => {
		const preloader = wrapper.ref(PRELOADER);
		expect(preloader.exists()).toBe(true);
	});

	it('should not display preloader spinner when done', () => {
		store.state.socket.isPendingAuth = false;

		const preloader = wrapper.ref(PRELOADER);
		expect(preloader.exists()).toBe(false);

		const main = wrapper.ref(MAIN);
		expect(main.exists()).toBe(true);
	});
});
