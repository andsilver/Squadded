import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Community from './community.vue';
import Store from '~/store';
import { SquadAPI } from '~/services/SquadAPI';

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

	let $router;
	let localVue;
	let store;
	let wrapper;

	beforeEach(() => {
		SquadAPI.fetchStreet.mockClear();
		localVue = createLocalVue();
		localVue.use(Vuex);

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
			data: () => ({
				showDialog: false,
			}),
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
		expect(wrapper.vm.showDialog).toBe(true);
	});

	it('should go to signin on screen click', () => {
		const street = wrapper.ref(STREET);
		street.trigger('click');
		expect(wrapper.vm.showDialog).toBe(true);
	});
});
