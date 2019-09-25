import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../../test/feed.item.mock';
import FeedPost from './Post.vue';

const localVue = createLocalVue();

Wrapper.prototype.getByAutoId = function (id) {
	return this.find(`[data-auto-id="${id}"]`);
};

describe('Feed Post', () => {
	describe('Comments', () => {
		const COUNTER_ID = 'comments-count';
		const ICON_ID = 'comments-icon';

		it('should display chat icon only when no comments', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().get();
			const wrapper = shallowMount(FeedPost, {
				localVue,
				propsData: {
					post,
				},
			});

			expect(wrapper.getByAutoId(COUNTER_ID).exists()).toBe(false);

			const icon = wrapper.getByAutoId(ICON_ID);
			expect(icon.text()).toBe('mdi-chat-outline');
		});

		it('should display chat icon and number of comments', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withComment().get();
			const wrapper = shallowMount(FeedPost, {
				localVue,
				propsData: {
					post,
				},
			});

			const counter = wrapper.getByAutoId(COUNTER_ID);
			expect(counter.exists()).toBe(true);
			expect(counter.text()).toBe(post.comments.length.toString());

			const icon = wrapper.getByAutoId(ICON_ID);
			expect(icon.text()).toBe('mdi-chat-outline');
		});
	});

	describe('Likes', () => {
		const COUNTER_ID = 'likes-count';
		const ICON_ID = 'likes-icon';

		it('shoud display heart and likes counter', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withLikes().get();
			const wrapper = shallowMount(FeedPost, {
				localVue,
				propsData: {
					post,
				},
			});

			expect(wrapper.getByAutoId(COUNTER_ID).text()).toBe(post.likes.count.toString());

			const icon = wrapper.getByAutoId(ICON_ID);
			expect(icon.text()).toBe('mdi-heart');
			expect(icon.attributes('color')).not.toBe('red');
		});

		it('shoud display red heart when liked by me', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withLikes(1, true).get();
			const wrapper = shallowMount(FeedPost, {
				localVue,
				propsData: {
					post,
				},
			});

			expect(wrapper.getByAutoId(COUNTER_ID).text()).toBe(post.likes.count.toString());

			const icon = wrapper.getByAutoId(ICON_ID);
			expect(icon.text()).toBe('mdi-heart');
			expect(icon.attributes('color')).toBe('red');
		});

		it('shoud display heart but no likes counter', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().withLikes(0).get();
			const wrapper = shallowMount(FeedPost, {
				localVue,
				propsData: {
					post,
				},
			});

			expect(wrapper.getByAutoId(COUNTER_ID).exists()).toBe(false);

			const icon = wrapper.getByAutoId(ICON_ID);
			expect(icon.text()).toBe('mdi-heart-outline');
			expect(icon.attributes('color')).not.toBe('red');
		});
	});
});
