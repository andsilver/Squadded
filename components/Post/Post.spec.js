import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import FeedPost from './index.vue';
import { flushPromises } from '~/helpers';
import Store from '~/store';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { UserStore, UserMutations } from '~/store/user';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { userMockBuilder } from '~/test/user.mock';
import { SquadAPI } from '~/services/SquadAPI';

jest.mock('~/services/SquadAPI', () => ({
	SquadAPI: {
		openProduct: jest.fn(),
	},
}));

const mocks = {
	$t: msg => msg,
	$tc: msg => msg,
};

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Feed Post', () => {
	const USER_LINK = 'user-link';
	let localVue;
	let post;
	let store;
	let wrapper;

	function initLocalVue () {
		SquadAPI.openProduct.mockClear();
		localVue = createLocalVue();
		localVue.use(Vuex);

		post = aDefaultSingleItemMsgBuilder().withGUID().get();
		store = new Vuex.Store(Store);

		wrapper = shallowMount(FeedPost, {
			localVue,
			mocks,
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

	describe('Product', () => {
		const IAMGE = 'item-image';
		const PRICE = 'item-price';
		const TITLE = 'item-title';

		it('should open product on click', () => {
			const triggerElements = [IAMGE, PRICE, TITLE];
			expect.assertions(4);

			triggerElements.forEach((el) => {
				const element = wrapper.ref(el);
				wrapper.vm.openProduct = jest.fn();
				element.trigger('click');
				expect(SquadAPI.openProduct).toHaveBeenCalledWith(post.item);
			});
			expect(SquadAPI.openProduct).toHaveBeenCalledTimes(3);
		});
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
		const COUNTER_ID = 'comments-count';
		const ICON_ID = 'comments-icon';
		const COMMENTS_LIST = 'comments-list';
		const COMMENT_INPUT = 'comment-input';

		it('should display chat icon only when no comments', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().get();

			wrapper.setProps({ post });

			expect(wrapper.ref(COUNTER_ID).exists()).toBe(false);

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-chat-message-oval-outlined-speech-bubble');
		});

		it('should display chat icon and number of comments', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withComment().get();
			wrapper.setProps({ post });

			const counter = wrapper.ref(COUNTER_ID);
			expect(counter.exists()).toBe(true);
			expect(counter.text()).toBe(post.comments.messages.length.toString());

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-chat-message-oval-outlined-speech-bubble');
		});

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

	describe('Likes', () => {
		const COUNTER_ID = 'likes-count';
		const ICON_ID = 'likes-icon';

		it('shoud display heart and likes counter', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withLikes().get();
			wrapper.setProps({ post });

			expect(wrapper.ref(COUNTER_ID).text()).toBe(post.likes.count.toString());

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-favorite-heart-button');
			expect(icon.attributes('color')).not.toBe('red');
		});

		it('shoud display red heart when liked by me', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withLikes(1, true).get();
			wrapper.setProps({ post });

			expect(wrapper.ref(COUNTER_ID).text()).toBe(post.likes.count.toString());

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-favorite-heart-button');
			expect(icon.attributes('color')).toBe('red');
		});

		it('shoud display heart but no likes counter', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withLikes(0).get();
			wrapper.setProps({ post });

			expect(wrapper.ref(COUNTER_ID).exists()).toBe(false);

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-favorite-heart-button-outline');
			expect(icon.attributes('color')).not.toBe('red');
		});
	});
});
