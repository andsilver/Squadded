import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Blog from './index.vue';
import Store from '~/store';
import { UserStore, UserMutations } from '~/store/user';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

function flushPromises() {
	return new Promise(resolve => setImmediate(resolve));
}

describe('Blog Component', () => {
	const EMPTY_FEED_TEXT = 'empty-blog-text';
	const PRELOADER = 'preloader';
	let query;
	let mocks;

	let localVue;
	let store;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);
		store.commit('jSocket', {
			sendObj: jest.fn(),
		});
	}

	beforeEach(() => {
		initLocalVue();
		query = {};
		mocks = {
			$t: msg => msg,
			$route: {
				query,
			},
		};
	});

	it('sets the correct default props', () => {
		const wrapper = shallowMount(Blog, {
			localVue,
			store,
			mocks,
		});
		expect(wrapper.vm.blog).toBe(null);

		expect(store.state.socket.$ws.sendObj).toHaveBeenCalledWith({
			type: 'fetchBlog',
		});
	});

	it('should render preloader', () => {
		const wrapper = shallowMount(Blog, {
			localVue,
			store,
			mocks,
		});
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(false);
	});

	it('renders the correct message for empty Blog', async () => {
		expect.assertions(2);

		const wrapper = shallowMount(Blog, {
			localVue,
			store,
			mocks,
		});

		store.state.user.other = {};
		store.commit(`${UserStore}/${UserMutations.setBlog}`, {
			blog: [],
		});

		await flushPromises();

		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).text()).toBe('feed.isEmpty');
	});
});
