import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Default from './default.vue';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Message Input', () => {
	const MAIN = 'main-content';
	const PRELOADER = 'preloader';

	let localVue;
	let store;
	let wrapper;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store({
			state: {
				socket: {
					isPendingAuth: true,
				},
			},
		});

		wrapper = shallowMount(Default, {
			store,
			localVue,
		});
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
