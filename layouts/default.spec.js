import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Default from './default.vue';
import Store from '~/store';
import * as Device from '~/utils/device-input';

jest.mock('~/utils/device-input', () => ({
	isTouch: jest.fn(() => true),
	onToggleKeyboard: jest.fn(),
}));

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Default layout', () => {
	const APP = 'app';
	const MAIN = 'main-content';
	const PRELOADER = 'preloader';
	const TAB_BAR = 'tab-bar';
	const NOTIFICATIONS = 'notifications';

	let localVue;
	let store;
	let wrapper;
	let $route;
	let $router;

	function initVue() {
		localVue = createLocalVue();
		localVue.use(Vuex);
		$route = {
			name: 'home',
			path: '/home',
		};
		$router = {
			push: jest.fn(),
		};

		localStorage.clear();

		store = new Vuex.Store(Store);

		wrapper = shallowMount(Default, {
			store,
			localVue,
			mocks: {
				$route,
				$router,
			},
		});
	}

	beforeEach(initVue);

	afterEach(() => {
		Device.isTouch.mockClear();
		Device.onToggleKeyboard.mockClear();
	});

	it('should contain required components', () => {
		store.state.socket.isAuth = true;
		expect(wrapper.ref(APP).exists()).toBe(true);
		expect(wrapper.ref(MAIN).exists()).toBe(true);
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
		expect(wrapper.ref(TAB_BAR).exists()).toBe(true);
		expect(wrapper.ref(NOTIFICATIONS).exists()).toBe(true);
	});

	it('should display tabs at home', () => {
		const app = wrapper.ref(APP);
		expect(app.classes('show-tabs')).toBe(true);
	});

	// it('should display tabs for logged in user', () => {
	// 	store.state.socket.isAuth = true;
	// 	const app = wrapper.ref(APP);
	// 	expect(app.classes('show-tabs')).toBe(true);
	// });

	/*
	 * Commenting before getting solution on checking keyboard open on IOS
	 */
	// it('should not display tabs if onscreen keyboard is open', () => {
	// 	store.state.socket.isAuth = true;
	// 	store.state.squad.virtualKeyboard = true;
	// 	const app = wrapper.ref(APP);
	// 	expect(app.classes('show-tabs')).toBe(false);
	// });

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

	describe('Desktop', () => {
		beforeEach(() => {
			Device.isTouch.mockReturnValue(false);
			initVue();
		});

		// it('should always display tabs for desktop', () => {
		// 	store.state.socket.isAuth = true;
		// 	store.state.squad.virtualKeyboard = false;
		// 	const app = wrapper.ref(APP);
		// 	expect(app.classes('show-tabs')).toBe(true);
		// });

		// it('should not listen on toggle virtual keyboard', () => {
		// 	expect(Device.onToggleKeyboard).not.toHaveBeenCalled();
		// });
	});
});
