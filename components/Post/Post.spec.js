import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import FeedPost from './index.vue';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { FeedStore, FeedActions } from '~/store/feed';
import Store from '~/store';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Feed Post', () => {
	const USER_LINK = 'user-link';
	let localVue;
	let wrapper;
	let store;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		const post = aDefaultSingleItemMsgBuilder().withGUID().get();
		store = new Vuex.Store(Store);

		wrapper = shallowMount(FeedPost, {
			localVue,
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
			expect(icon.text()).toBe('mdi-chat-outline');
		});

		it('should display chat icon and number of comments', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withComment().get();
			wrapper.setProps({ post });

			const counter = wrapper.ref(COUNTER_ID);
			expect(counter.exists()).toBe(true);
			expect(counter.text()).toBe(post.comments.messages.length.toString());

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('mdi-chat-outline');
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

		it('should toggle list and fetch comments', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withComment().get();
			wrapper.setProps({ post });

			expect(wrapper.vm.showComments).toBe(false);

			const $ws = {
				sendObj: jest.fn(),
			};
			wrapper.vm.$ws = $ws;
			wrapper.vm.toggleComments();

			expect(wrapper.vm.showComments).toBe(true);
			const actualArgs = $ws.sendObj.mock.calls[0];
			expect(actualArgs[0]).toMatchObject({
				type: 'fetchComments',
				guid: post.guid,
			});
		});

		it('should display input comment element and set correct props', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().get();
			wrapper.setProps({ post });

			wrapper.setData({
				showComments: true,
			});

			const comments = wrapper.ref(COMMENT_INPUT);
			expect(comments.exists()).toBe(true);
			expect(comments.attributes('guid')).toBe(post.guid);
			expect(comments.attributes('action')).toBe(`${FeedStore}/${FeedActions.sendComment}`);
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
			expect(icon.text()).toBe('mdi-heart');
			expect(icon.attributes('color')).not.toBe('red');
		});

		it('shoud display red heart when liked by me', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withLikes(1, true).get();
			wrapper.setProps({ post });

			expect(wrapper.ref(COUNTER_ID).text()).toBe(post.likes.count.toString());

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('mdi-heart');
			expect(icon.attributes('color')).toBe('red');
		});

		it('shoud display heart but no likes counter', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withLikes(0).get();
			wrapper.setProps({ post });

			expect(wrapper.ref(COUNTER_ID).exists()).toBe(false);

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('mdi-heart-outline');
			expect(icon.attributes('color')).not.toBe('red');
		});
	});
});
