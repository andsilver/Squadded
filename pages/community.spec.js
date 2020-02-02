import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Community from './community.vue';
import Store from '~/store';
import { SquadAPI } from '~/services/SquadAPI';
import { Storage } from '~/test/storage.mock';

jest.mock('~/services/SquadAPI', () => ({
	SquadAPI: {
		fetchStreet: jest.fn(),
	},
}));

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Message Input', () => {
	const STREET = 'street-layout';
	const START_WATCHING_DIALOG = 'start-watching-dialog';

	let $router;
	let localVue;
	let store;
	let wrapper;

	beforeEach(() => {
		SquadAPI.fetchStreet.mockClear();
		localVue = createLocalVue();
		localVue.use(Vuex);

		global.sessionStorage = new Storage();
		sessionStorage.clear();

		$router = {
			push: jest.fn(),
		};
		store = new Vuex.Store(Store);

		wrapper = shallowMount(Community, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
	});

	it('should contain a Street feed', () => {
		const street = wrapper.ref(STREET);
		expect(street.exists()).toBe(true);
	});

	it('should fetch Street feed after widget open', () => {
		store.state.merchant.id = 'some-merchant-is';
		wrapper.vm.$root.$emit('widget-open');
		expect(SquadAPI.fetchStreet).toHaveBeenCalledWith(store.state.merchant.id);
	});

	it('should go to signin on mouse down', () => {
		const street = wrapper.ref(STREET);
		street.trigger('mousedown');
		expect($router.push).toHaveBeenCalledWith('/');
	});

	it('should go to signin on screen touch', () => {
		const street = wrapper.ref(STREET);
		street.trigger('touchstart');
		expect($router.push).toHaveBeenCalledWith('/');
	});

	it('should display StartWatchingDialog on first visit', () => {
		expect(wrapper.ref(START_WATCHING_DIALOG).exists()).toBe(true);
	});
});
