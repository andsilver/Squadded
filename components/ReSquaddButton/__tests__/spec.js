import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import Vuex from 'vuex';
import ReSquaddButton from '../index.vue';
import Store from '~/store';
import { FeedStore, FeedActions } from '~/store/feed';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

const localVue = createLocalVue();
localVue.use(Vuex);

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('ReSquadd Button', () => {
	const RESQUADD_BUTTON = 'resquadd-button';
	let reSquaddItem;
	let post;
	let store;
	let wrapper;

	beforeEach(() => {
		post = aDefaultSingleItemMsgBuilder().withGUID().get();
		reSquaddItem = `${FeedStore}/${FeedActions.reSquaddItem}`;
		store = new Vuex.Store(Store);
		store.dispatch = jest.fn();

		wrapper = shallowMount(ReSquaddButton, {
			store,
			localVue,
			propsData: {
				item: post.item,
			},
		});
	});

	it('Should dispatch action save post item', (done) => {
		expect(wrapper.ref(RESQUADD_BUTTON).exists()).toBe(true);
		expect(wrapper.ref(RESQUADD_BUTTON).classes('is-resquadded')).toBe(false);

		wrapper.ref(RESQUADD_BUTTON).trigger('click');

		expect(store.dispatch).toHaveBeenCalledWith(reSquaddItem, { item: post.item });
		expect(post.item.squadded).toBe(true);
		expect(wrapper.vm.item.squadded).toBe(true);
		expect(wrapper.ref(RESQUADD_BUTTON).classes()).toContain('is-resquadded');

		done();
	});
});
