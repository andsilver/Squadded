import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import Vuex from 'vuex';
import ReSquaddButton from './ResquaddButton.vue';
import { flushPromises } from '~/helpers';
import Store from '~/store';
import { ActivityStore, ActivityActions } from '~/store/activity';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

const localVue = createLocalVue();
localVue.use(Vuex);

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

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

	beforeEach(() => {
		post = aDefaultSingleItemMsgBuilder()
			.withGUID()
			.get();
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
				$t: msg => msg,
			},
		});
	});

	it('Should resqaud item', async (done) => {
		const resquadd = wrapper.ref(RESQUADD_BUTTON);
		expect(resquadd.exists()).toBe(true);
		expect(resquadd.props('active')).toBe(true);

		resquadd.trigger('click');
		await flushPromises();

		expect(dispatch).toHaveBeenCalledWith(reSquaddItem, { item: post.item });
		expect(post.item.squadded).toBe(true);
		expect(wrapper.vm.item.squadded).toBe(true);
		expect(resquadd.props('active')).toBe(true);
		expect(store.state.feed.items[0]).toBe(store.state.post.all[0]);

		done();
	});

	it('Should unwish item', async (done) => {
		post.item.squadded = true;
		wrapper.vm.$forceUpdate();
		const resquadd = wrapper.ref(RESQUADD_BUTTON);
		expect(resquadd.exists()).toBe(true);
		expect(resquadd.props('active')).toBe(true);

		resquadd.trigger('click');

		expect(dispatch).toHaveBeenCalledWith(unwish, post.item);
		await flushPromises();
		expect(commit).toHaveBeenCalledWith(unsquad, post.item.itemId);
		expect(post.item.squadded).toBe(false);
		expect(wrapper.vm.item.squadded).toBe(false);
		expect(resquadd.props('active')).toBe(false);

		done();
	});
});
