import { Wrapper, shallowMount } from '@vue/test-utils';
import GroupedPosts from '../GroupedPosts.vue';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('GroupedPosts', () => {
	const GROUPED_POST = 'grouped-post';
	let post;
	let wrapper;

	function initLocalVue() {
		const item1 = aDefaultSingleItemMsgBuilder()
			.withUser()
			.get();
		const item2 = aDefaultSingleItemMsgBuilder().get();
		item2.userId = item1.userId;
		post = {
			items: [item1, item2],
		};

		wrapper = shallowMount(GroupedPosts, {
			propsData: {
				post,
			},
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should render grouped post card', () => {
		expect(wrapper.ref(GROUPED_POST).exists()).toBe(true);
	});

	it('should render correct number of items', () => {
		const items = wrapper.findAll('v-slide-item');
		expect(items.length).toBe(post.items.length);
	});
});
