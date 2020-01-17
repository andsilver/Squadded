import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Reactions from './reactions.vue';
import Store from '~/store';
import { PostStore, PostMutations } from '~/store/post';
import { prefetch } from '~/helpers';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

jest.mock('~/helpers/index', () => ({
	prefetch: jest.fn(),
}));

describe('Post Reactions', () => {
	const BACK_BAR = 'back-bar';
	const USER_LINK = 'user-link';
	const USER_NAME_TYPE = 'user-name-type';
	const PRODUCT_IMAGE = 'product-image';
	const COMMENTS_TAB = 'comments-tab';
	const LIKES_TAB = 'likes-tab';

	let $router;
	let localVue;
	let store;
	let wrapper;
	let params;
	let post;

	const initLocalVue = () => {
		wrapper = shallowMount(Reactions, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
				$router,
				$route: {
					params,
					hash: {},
				},
			},
		});
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		$router = {
			push: jest.fn(),
		};
		post = aDefaultSingleItemMsgBuilder()
			.withGUID()
			.get();
		params = {
			id: post.guid,
		};
	});

	it('should render correct contents', () => {
		store.commit(`${PostStore}/${PostMutations.addPost}`, post);

		initLocalVue();

		const backBar = wrapper.ref(BACK_BAR);
		const userLink = wrapper.ref(USER_LINK);
		const userNameType = wrapper.ref(USER_NAME_TYPE);
		const productImage = wrapper.ref(PRODUCT_IMAGE);
		const commentsTab = wrapper.ref(COMMENTS_TAB);
		const likesTab = wrapper.ref(LIKES_TAB);
		expect(backBar.exists()).toBe(true);
		expect(userLink.exists()).toBe(true);
		expect(userNameType.exists()).toBe(true);
		expect(productImage.exists()).toBe(true);
		expect(commentsTab.exists()).toBe(true);
		expect(likesTab.exists()).toBe(true);
	});

	it('should not render content if post is not exist', () => {
		prefetch.mockReturnValue(Promise.resolve());
		initLocalVue();
		const userLink = wrapper.ref(USER_LINK);
		expect(userLink.exists()).toBe(false);
	});

	it('should call prefetch if post is not exist', () => {
		initLocalVue();
		expect(prefetch).toHaveBeenCalledWith({
			postId: params.id,
			mutation: `${PostStore}/${PostMutations.setCurrentPost}`,
			store,
			type: 'fetchPost',
		});
	});

	it('should render content if prefetch is success', () => {
		prefetch.mockReturnValue(Promise.resolve(post));
		initLocalVue();
		prefetch().then(() => {
			const userLink = wrapper.ref(USER_LINK);
			expect(userLink.exists()).toBe(true);
		});
	});
});
