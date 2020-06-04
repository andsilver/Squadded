import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import GoBackBtn from '../GoBackBtn.vue';
import Store from '~/store';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('GoBackBtn', () => {
	let localVue;
	let wrapper;
	let store;
	const $router = {
		push: jest.fn(),
		back: jest.fn(),
		history: {
			stack: [],
			current: {
				name: 'index',
			},
		},
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		wrapper = shallowMount(GoBackBtn, {
			localVue,
			store,
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
	});

	it('should navigate to back on click GoBackBtn', () => {
		store.commit('SET_SOCKET_AUTH', true);
		const goBackBtn = wrapper.ref('go-back-btn');
		goBackBtn.trigger('click');
		expect($router.back).toHaveBeenCalled();
	});

	it('should navigate to community if not auth', () => {
		store.commit('SET_SOCKET_AUTH', false);
		const goBackBtn = wrapper.ref('go-back-btn');
		goBackBtn.trigger('click');
		expect($router.push).toHaveBeenCalledWith('/community');
	});
});
