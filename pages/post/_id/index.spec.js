import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import LandingPost from './index.vue';
import { userMockBuilder } from '~/test/user.mock';
import Store from '~/store';
import { PostStore, PostMutations } from '~/store/post';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { prefetch } from '~/helpers';

jest.mock('~/helpers', () => ({
	prefetch: jest.fn(),
}));

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Landing Post', () => {
	let wrapper;
	let store;
	let localVue;
	const user = userMockBuilder().short();
	const post = aDefaultSingleItemMsgBuilder()
		.withGUID()
		.get();

	const $router = {
		push: jest.fn(),
	};

	const $route = {
		params: {
			id: 'someid',
		},
		hash: '',
	};

	const BACK_BAR = 'back-bar';
	const POST_COMPONENT = 'post-component';
	const DIALOG = 'dialog';

	const initLocalVue = () => {
		wrapper = shallowMount(LandingPost, {
			store,
			localVue,
			propsData: {
				user,
				show: true,
			},
			mocks: {
				$t: msg => msg,
				$router,
				$route,
			},
		});
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
	});

	it('should render correct contents', async () => {
		prefetch.mockReturnValue(Promise.resolve(post));
		initLocalVue();
		await prefetch();
		const backBar = wrapper.ref(BACK_BAR);
		const postComponent = wrapper.ref(POST_COMPONENT);
		const dialog = wrapper.ref(DIALOG);
		expect(backBar.exists()).toBe(true);
		expect(postComponent.exists()).toBe(true);
		expect(dialog.exists()).toBe(true);
	});

	it('should send fetchPost message', () => {
		prefetch.mockReturnValue(Promise.resolve(post));
		store.commit('SET_SOCKET_AUTH', true);
		initLocalVue();
		expect(prefetch).toHaveBeenCalledWith({
			postId: $route.params.id,
			mutation: `${PostStore}/${PostMutations.setCurrentPost}`,
			store,
			type: 'fetchPost',
		});
	});

	it('should show NotSignedInDialog when not signed in', async () => {
		prefetch.mockReturnValue(Promise.resolve(post));
		initLocalVue();
		await prefetch();
		expect(wrapper.vm.showNotSignedInDialog).toBe(true);
	});

	it('should display correct title', async () => {
		prefetch.mockReturnValue(Promise.resolve(post));
		initLocalVue();
		await prefetch();
		expect(wrapper.vm.title).toBe('post.title.singleItemPost');

		$route.hash = '#comments';
		initLocalVue();
		await prefetch();
		expect(wrapper.vm.title).toBe('post.title.comments');
	});

	it('should go to user profile page if the post is private', async () => {
		post.private = true;
		post.byMe = false;
		post.userId = 'auserid';
		prefetch.mockReturnValue(Promise.resolve(post));
		initLocalVue();
		await prefetch();
		expect($router.push).toHaveBeenCalledWith(`/user/${post.userId}`);
	});
});
