import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SelectItems from './SelectItems.vue';
import { flushPromises } from '~/helpers';
import Store from '~/store';
import { regularPostBuilder } from '~/test/post.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('SelectItems Component', () => {
	const ITEMS = 'items';
	let mocks;

	let localVue;
	let store;
	let wrapper;
	let ws;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		ws = {
			sendObj: jest.fn(),
		};
		store = new Vuex.Store(Store);
		store.commit('jSocket', ws);
	}

	beforeEach(() => {
		initLocalVue();
		mocks = {
			$t: msg => msg,
		};
		wrapper = shallowMount(SelectItems, {
			localVue,
			store,
			mocks,
		});
	});

	it('should fetchWishlist on create', async () => {
		expect(wrapper.vm.wishlist).toBe(null);

		store.commit('SET_SOCKET_AUTH', true);
		await flushPromises();

		expect(ws.sendObj).toHaveBeenCalledWith({
			type: 'fetchWishlist',
		});
	});

	it('should select on click', () => {
		const post1 = regularPostBuilder()
			.withGUID()
			.get();
		wrapper.vm.$emit = jest.fn();
		store.state.activity.wishlist = [post1];

		wrapper.vm.$refs[ITEMS][0].$el.click();

		expect(wrapper.vm.selected).toEqual([post1]);
		expect(wrapper.vm.$emit).toHaveBeenCalledWith('select', [post1.item]);
	});

	it('should unselect all wishlist posts', () => {
		const post1 = regularPostBuilder()
			.withGUID()
			.get();
		post1.selected = true;
		store.state.activity.wishlist = [post1];

		wrapper.destroy();
		expect(post1.selected).toBe(false);
	});
});
