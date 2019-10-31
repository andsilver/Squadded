import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import NewPoll from './new.vue';
import Store from '~/store';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('New Poll', () => {
	const GO_BACK = 'goback-button';
	const TEXT_FIELD = 'text-field';
	const SELECT_ITEM = 'select-items';
	const DONE = 'done-button';

	let localVue;
	let store;
	let wrapper;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
		store.commit('SET_SOCKET_AUTH', true);

		wrapper = shallowMount(NewPoll, {
			localVue,
			store,
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should contain required element', () => {
		expect(wrapper.ref(GO_BACK).exists()).toBe(true);
		expect(wrapper.ref(TEXT_FIELD).exists()).toBe(true);
		expect(wrapper.ref(SELECT_ITEM).exists()).toBe(true);
		expect(wrapper.ref(DONE).exists()).toBe(true);
	});
});
