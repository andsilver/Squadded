import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SelectItems from './SelectItems.vue';
import { flushPromises } from '~/helpers';
import Store from '~/store';
import { regularPostBuilder } from '~/test/post.mock';
import { fetchLastItems } from '~/services/post';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

jest.mock('~/services/post', () => ({
	fetchLastItems: jest.fn(),
}));

describe('SelectItems Component', () => {
	const ITEM = 'item';
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
		fetchLastItems.mockReturnValue([]);
		wrapper = shallowMount(SelectItems, {
			localVue,
			store,
			mocks,
			propsData: {
				coords: [{
					x: 10,
					y: 10,
					id: 'someid',
				}],
			},
		});
	});

	it('should fetchWishlist and fetchLastItems on create', async () => {
		expect(wrapper.vm.wishlist).toBe(null);

		store.commit('SET_SOCKET_AUTH', true);
		await flushPromises();

		expect(ws.sendObj).toHaveBeenCalledWith({
			type: 'fetchWishlist',
		});
		expect(fetchLastItems).toHaveBeenCalled();
	});

	it('should render wishlist and last items', () => {
		const wishlistItems = wrapper.ref('wishlist-items');
		const lastItems = wrapper.ref('last-items');

		expect(wishlistItems.exists()).toBe(true);
		expect(lastItems.exists()).toBe(true);
	});

	it('should select on click', () => {
		const post1 = regularPostBuilder()
			.withGUID()
			.get();
		wrapper.vm.$emit = jest.fn();
		store.state.activity.wishlist = [post1];

		wrapper.vm.$refs[ITEM][0].$el.click();

		expect(wrapper.vm.selected).toEqual([post1]);
		expect(wrapper.vm.$emit).toHaveBeenCalledWith('select', [post1.item], post1.postId);
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

	it('should filter posts on search', () => {
		const posts = new Array(3).fill(regularPostBuilder().withGUID().get());
		const searchText = 'testitemtitle';
		posts[0].item.title = searchText;
		store.state.activity.wishlist = posts;
		wrapper.setData({ searchText });
		expect(wrapper.vm.items.wishlist[0].item.title).toBe(searchText);
	});

	it('should not select if select tags are less than selected items', () => {
		const post1 = regularPostBuilder()
			.withGUID()
			.get();
		wrapper.vm.$emit = jest.fn();
		store.state.activity.wishlist = [post1];
		wrapper.setProps({
			coords: [],
			isPhoto: true,
		});
		wrapper.vm.$refs[ITEM][0].$el.click();
		expect(wrapper.vm.$emit).not.toHaveBeenCalled();
	});
});
