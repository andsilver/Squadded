import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import NewPoll from './poll.vue';
import { flushPromises } from '~/helpers';
import Store from '~/store';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';
import { regularPostBuilder } from '~/test/post.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('New Poll', () => {
	const GO_BACK = 'goback-button';
	const TEXT_FIELD = 'text-field';
	const SELECT_ITEM1 = 'select-item1';
	const SELECT_ITEM2 = 'select-item2';
	const EXPIRATION_PICKER = 'expiration';
	const DONE = 'done-button';

	let $router;
	let localVue;
	let post1, post2;
	let store;
	let wrapper;

	beforeEach(() => {
		post1 = regularPostBuilder()
			.withGUID()
			.get();
		post2 = regularPostBuilder()
			.withGUID()
			.get();
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
		store.commit('SET_SOCKET_AUTH', true);
		$router = {
			push: jest.fn(),
		};

		wrapper = shallowMount(NewPoll, {
			localVue,
			store,
			mocks: {
				$t: msg => msg,
				$router,
			},
		});
	});

	it('should contain required element', () => {
		expect(wrapper.ref(GO_BACK).exists()).toBe(true);
		expect(wrapper.ref(TEXT_FIELD).exists()).toBe(true);
		expect(wrapper.ref(SELECT_ITEM1).exists()).toBe(true);
		expect(wrapper.ref(SELECT_ITEM2).exists()).toBe(true);
		expect(wrapper.ref(EXPIRATION_PICKER).exists()).toBe(true);
		expect(wrapper.ref(DONE).exists()).toBe(true);
	});

	it('should not create until complete', () => {
		wrapper.vm.create = jest.fn();
		const doneBtn = wrapper.ref(DONE);

		expect(doneBtn.props('disabled')).toBe(true);
		doneBtn.trigger('click');
		expect(wrapper.vm.create).not.toHaveBeenCalled();
	});

	it('should select items', () => {
		wrapper.vm.create = jest.fn();

		wrapper.vm.$refs[SELECT_ITEM1].$emit('select', [post1.item]);
		expect(wrapper.vm.item1).toBe(post1.item);

		wrapper.vm.$refs[SELECT_ITEM2].$emit('select', [post2.item]);
		expect(wrapper.vm.item2).toBe(post2.item);
	});

	it('should allow create when complete', () => {
		wrapper.vm.create = jest.fn();
		const doneBtn = wrapper.ref(DONE);
		const item1 = post1.item;
		const item2 = post2.item;
		wrapper.setData({
			item1,
			item2,
			text: 'Some poll description',
		});
		expect(doneBtn.props('disabled')).toBe(false);

		doneBtn.trigger('click');
		expect(wrapper.vm.create).toHaveBeenCalled();
	});

	it('should create', async () => {
		const post = { result: 'post' };
		store.dispatch = jest.fn().mockReturnValue(post);
		store.commit = jest.fn();
		const date = Date.now();
		wrapper.vm.$refs.expiration.date = date;

		const doneBtn = wrapper.ref(DONE);
		const text = 'Some poll description';
		const item1 = post1.item;
		const item2 = post2.item;
		wrapper.setData({
			item1,
			item2,
			text,
		});
		doneBtn.trigger('click');
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.saveItem}`, {
			item1,
			item2,
			expires: date,
			text,
			type: 'pollPost',
		});
		await flushPromises();
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.addItem}`, post);

		expect($router.push).toHaveBeenCalledWith('/feed');
	});
});
