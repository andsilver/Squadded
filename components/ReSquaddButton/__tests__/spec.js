import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import Vuex from 'vuex';
import ReSquaddButton from '../index.vue';
import { flushPromises } from '~/helpers';
import Store from '~/store';
import { ActivityStore, ActivityActions } from '~/store/activity';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { FeedStore, FeedMutations } from '~/store/feed';
import { HomeStore, HomeMutations } from '~/store/home';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { GA_ACTIONS } from '~/consts';

const localVue = createLocalVue();
localVue.use(Vuex);

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

jest.mock('~/utils/isAuth', () => ({
	checkActionPermission: jest.fn().mockReturnValue(Promise.resolve(true)),
}));

describe('ReSquadd Button', () => {
	const RESQUADD_BUTTON = 'resquadd-button';
	const reSquaddItem = `${PostStore}/${PostActions.reSquaddItem}`;
	const unwish = `${ActivityStore}/${ActivityActions.unwish}`;
	const unsquad = `${PostStore}/${PostMutations.unsquadd}`;
	let dispatch;
	let commit;
	let post;
	let store;
	let wrapper;

	const $gaActionPrivate = jest.fn();

	beforeEach(() => {
		post = aDefaultSingleItemMsgBuilder().withGUID().get();
		store = new Vuex.Store(Store);
		dispatch = spyOn(store, 'dispatch').and.callThrough();
		commit = spyOn(store, 'commit').and.callThrough();

		wrapper = shallowMount(ReSquaddButton, {
			store,
			localVue,
			propsData: {
				item: post.item,
			},
			mocks: {
				$gaActionPrivate,
			},
		});
	});

	it('Should resqaud item', async (done) => {
		const resquadd = wrapper.ref(RESQUADD_BUTTON);
		expect(resquadd.exists()).toBe(true);
		expect(resquadd.classes('is-resquadded')).toBe(false);

		resquadd.trigger('click');
		await flushPromises();

		expect(dispatch).toHaveBeenCalledWith(reSquaddItem, { item: post.item });
		expect(post.item.squadded).toBe(true);
		expect(wrapper.vm.item.squadded).toBe(true);
		expect(resquadd.classes()).toContain('is-resquadded');
		expect(store.state.feed.items[0]).toBe(store.state.post.all[0]);

		done();
	});

	it('Should unwish item', async (done) => {
		post.item.squadded = true;
		wrapper.vm.$forceUpdate();
		const resquadd = wrapper.ref(RESQUADD_BUTTON);
		expect(resquadd.exists()).toBe(true);
		expect(resquadd.classes()).toContain('is-resquadded');

		resquadd.trigger('click');
		await flushPromises();

		expect(dispatch).toHaveBeenCalledWith(unwish, post.item);
		expect(commit).toHaveBeenCalledWith(unsquad, post.item.itemId);
		expect(commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.unsquadd}`, post.item.itemId);
		expect(commit).toHaveBeenCalledWith(`${HomeStore}/${HomeMutations.unsquadd}`, post.item.itemId);
		expect(post.item.squadded).toBe(false);
		expect(wrapper.vm.item.squadded).toBe(false);
		expect(resquadd.classes('is-resquadded')).toBe(false);
		expect($gaActionPrivate).toHaveBeenCalledWith(GA_ACTIONS.WISHLIST_REMOVE);

		done();
	});
});
