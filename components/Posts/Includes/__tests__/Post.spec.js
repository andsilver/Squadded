import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Post from '../Post.vue';
import Store from '~/store';
import { PostStore, PostActions } from '~/store/post';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

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
		wrapper.setData({ visible: true });
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
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.withUser()
				.get();

			wrapper.setProps({ post });

			expect(wrapper.ref(POST_TEXT).exists()).toBe(false);
		});

		it('should display placeholder for author', () => {
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.get();
			post.byMe = true;

			wrapper.setProps({ post });

			expect(wrapper.ref(POST_TEXT).text()).toBe('post.textPlaceholder');
		});

		it('should toggle text input for author', () => {
			const post = aDefaultSingleItemMsgBuilder()
				.withGUID()
				.withText()
				.get();
			post.byMe = true;

			expect(wrapper.ref(POST_TEXT_INPUT).exists()).toBe(false);

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

		it('should not display comments list on init', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withComment().get();
			wrapper.setProps({ post });

			const comments = wrapper.ref(COMMENTS_LIST);
			expect(comments.exists()).toBe(false);
		});
	});
});
