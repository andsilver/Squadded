import { shallowMount, createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../../test/feed.item.mock';
import FeedPost from './Post.vue';

const localVue = createLocalVue();

describe('Feed Post', () => {
	it('shoud display heart and likes counter', () => {
		const post = aDefaultSingleItemMsgBuilder().withGUID().withLikes().get();
		const wrapper = shallowMount(FeedPost, {
			localVue,
			propsData: {
				post,
			},
		});

		const likes = wrapper.find('.likes');
		expect(likes.find('.count').text()).toBe(post.likes.toString());
		expect(likes.find('v-icon').text()).toBe('mdi-heart');
	});

	it('shoud display heart but no likes counter', () => {
		const post = aDefaultSingleItemMsgBuilder().withGUID().withLikes(0).get();
		const wrapper = shallowMount(FeedPost, {
			localVue,
			propsData: {
				post,
			},
		});

		const likes = wrapper.find('.likes');
		expect(likes.find('.count').exists()).toBe(false);
		expect(likes.find('v-icon').text()).toBe('mdi-heart');
	});
});
