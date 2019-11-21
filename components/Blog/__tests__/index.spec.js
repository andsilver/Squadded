import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Blog from '../index.vue';
import { flushPromises } from '~/helpers';
import Store from '~/store';
import { ActivityStore, ActivityMutations } from '~/store/activity';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Blog Component', () => {
	const EMPTY_FEED_TEXT = 'empty-blog-text';
	const PRELOADER = 'preloader';
	let params;
	let mocks;

	let localVue;
	let store;
	let wrapper;

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
		params = {};
		mocks = {
			$t: msg => msg,
			$route: {
				params,
			},
		};
		wrapper = shallowMount(Blog, {
			localVue,
			store,
			mocks,
		});
	});

	it('sets the correct default props', async () => {
		expect(wrapper.vm.blog).toBe(null);

		store.commit('SET_SOCKET_AUTH', true);
		await flushPromises();

		expect(store.state.socket.$ws.sendObj).toHaveBeenCalledWith({
			type: 'fetchBlog',
		});
	});

	it('should render preloader', () => {
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(false);
	});

	it('renders the correct message for empty Blog', () => {
		expect.assertions(2);
		store.state.activity.blog = [];

		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).text()).toBe('feed.isEmpty');
	});

	it('should clear prev data from blog', () => {
		store.commit = jest.fn();

		shallowMount(Blog, {
			localVue,
			store,
			mocks,
		});

		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.clearBlog}`);
	});
});
