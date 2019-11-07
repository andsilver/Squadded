import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Post from '../Post.vue';
import { flushPromises } from '~/helpers';
import Store from '~/store';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { UserStore, UserMutations } from '~/store/user';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Post', () => {
	const USER_LINK = 'user-link';
	let localVue;
	let post;
	let store;
	let wrapper;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		post = aDefaultSingleItemMsgBuilder().withGUID().get();
		store = new Vuex.Store(Store);

		wrapper = shallowMount(Post, {
			localVue,
			mocks: {
				$t: msg => msg,
				$tc: msg => msg,
			},
			propsData: {
				post,
			},
			store,
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should have user link', () => {
		const post = aDefaultSingleItemMsgBuilder().withGUID().get();

		wrapper.setProps({ post });
		expect(wrapper.ref(USER_LINK).exists()).toBe(true);
	});

	describe('Text', () => {
		const POST_TEXT = 'post-text';
		const POST_TEXT_INPUT = 'post-text-input';

		it('should display text', () => {
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.withText()
				.get();

			wrapper.setProps({ post });

			const postText = wrapper.ref(POST_TEXT);
			expect(postText.exists()).toBe(true);
			expect(postText.text()).toBe(post.text);
		});

		it('should not display empty text', () => {
			const me = userMockBuilder();
			store.commit(`${UserStore}/${UserMutations.setMe}`, me.get());
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.withUser()
				.get();

			wrapper.setProps({ post });

			expect(wrapper.ref(POST_TEXT).exists()).toBe(false);
		});

		it('should display placeholder for author', () => {
			const me = userMockBuilder();
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.withUser(me.short())
				.get();

			store.commit(`${UserStore}/${UserMutations.setMe}`, me.get());
			wrapper.setProps({ post });

			expect(wrapper.ref(POST_TEXT).text()).toBe('post.textPlaceholder');
		});

		it('should toggle text input for author', () => {
			const me = userMockBuilder();
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.withUser(me.short())
				.withText()
				.get();

			expect(wrapper.ref(POST_TEXT_INPUT).exists()).toBe(false);

			store.commit(`${UserStore}/${UserMutations.setMe}`, me.get());
			wrapper.setProps({ post });
			wrapper.setData({ showTextEditor: true });

			expect(wrapper.ref(POST_TEXT).exists()).toBe(false);
			const textInput = wrapper.ref(POST_TEXT_INPUT);
			expect(textInput.exists()).toBe(true);
			expect(textInput.props('action')).toBe(`${PostStore}/${PostActions.editText}`);
			expect(textInput.props('text')).toBe(post.text);
		});
	});

	describe('Comments', () => {
		const COMMENTS_LIST = 'comments-list';
		const COMMENT_INPUT = 'comment-input';

		it('should not display comments list on init', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withComment().get();
			wrapper.setProps({ post });

			const comments = wrapper.ref(COMMENTS_LIST);
			expect(comments.exists()).toBe(false);
		});

		it('should not display comments list when no comments', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().get();
			wrapper.setProps({ post });

			wrapper.setData({
				showComments: true,
			});

			const comments = wrapper.ref(COMMENTS_LIST);
			expect(comments.exists()).toBe(false);
		});

		it('should display comments list', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withComment().get();
			wrapper.setProps({ post });

			wrapper.setData({
				showComments: true,
			});

			const comments = wrapper.ref(COMMENTS_LIST);
			expect(comments.exists()).toBe(true);
		});

		it('should toggle list and fetch comments', async () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withComment([]).get();
			wrapper.setProps({ post });

			expect(wrapper.vm.showComments).toBe(false);

			const comments = [{ text: 'text' }];
			const $ws = {
				sendObj: jest.fn(),
			};
			store.state.socket.$ws = $ws;

			wrapper.vm.toggleComments();
			store.commit(`${PostStore}/${PostMutations.receiveComments}`, comments);
			await flushPromises();

			expect(wrapper.vm.showComments).toBe(true);
			expect($ws.sendObj).toHaveBeenCalledWith({
				type: 'fetchComments',
				guid: post.guid,
			});
			expect(post.comments.messages).toEqual(comments);
		});

		it('should display input comment element and set correct props', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().get();
			wrapper.setProps({ post });

			wrapper.setData({
				showComments: true,
			});

			const comments = wrapper.ref(COMMENT_INPUT);
			expect(comments.exists()).toBe(true);
			expect(comments.props('post')).toBe(post);
			expect(comments.props('action')).toBe(`${PostStore}/${PostActions.sendComment}`);
		});
	});
});
