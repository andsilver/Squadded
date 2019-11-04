import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import Vuex from 'vuex';
import ReSquaddButton from './index.vue';
import Store from '~/store';
import { FeedStore, FeedActions } from '~/store/feed';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { flushPromises } from '~/helpers';

const localVue = createLocalVue();
localVue.use(Vuex);

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('ReSquadd Button', () => {
	const RESQUADD_BUTTON = 'resquadd-button';
	let saveItem;
	let post;
	let store;
	let wrapper;

	beforeEach(() => {
		post = aDefaultSingleItemMsgBuilder().withGUID().get();
		saveItem = `${FeedStore}/${FeedActions.saveItem}`;
		store = new Vuex.Store(Store);
		store.dispatch = jest.fn();

		wrapper = shallowMount(ReSquaddButton, {
			store,
			localVue,
			propsData: {
				post,
			},
		});
	});

	it('Should dispatch action save post item', async (done) => {
		wrapper.setData({
			isReSquadded: false,
		});

		expect(wrapper.ref(RESQUADD_BUTTON).exists()).toBe(true);
		expect(wrapper.ref(RESQUADD_BUTTON).classes('is-resquadded')).toBe(false);

		wrapper.ref(RESQUADD_BUTTON).trigger('click');
		await flushPromises();

		expect(store.dispatch).toHaveBeenCalledWith(saveItem, { item: post.item });
		expect(wrapper.vm.isReSquadded).toBe(true);
		expect(wrapper.ref(RESQUADD_BUTTON).classes('is-resquadded')).toBe(true);

		done();
	});
});
