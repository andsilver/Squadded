import { Chance } from 'chance';
import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Actions from '../Actions.vue';
import Store from '~/store';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

const chance = new Chance();

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Post Actions', () => {
	let localVue;
	let post;
	let store;
	let wrapper;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);

		post = aDefaultSingleItemMsgBuilder().withGUID().get();
		store = new Vuex.Store(Store);

		wrapper = shallowMount(Actions, {
			localVue,
			propsData: {
				post,
			},
			store,
			mocks: {
				_i18n: {
					locale: 'en',
				},
			},
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	describe('Likes', () => {
		const COUNTER_ID = 'likes-count';
		const ICON_ID = 'likes-icon';

		it('shoud display heart and likes counter', () => {
			post = aDefaultSingleItemMsgBuilder().withGUID().withLikes().get();
			wrapper.setProps({ post });

			expect(wrapper.ref(COUNTER_ID).text()).toBe(wrapper.vm.short(post.likes.count));

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-favorite-heart-button');
			expect(icon.attributes('color')).not.toBe('red');
		});

		it('shoud display red heart when liked by me', () => {
			post = aDefaultSingleItemMsgBuilder().withGUID().withLikes(1, true).get();
			wrapper.setProps({ post });

			expect(wrapper.ref(COUNTER_ID).text()).toBe(wrapper.vm.short(post.likes.count));

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-favorite-heart-button');
			expect(icon.attributes('color')).toBe('red');
		});

		it('shoud display heart but no likes counter', () => {
			post = aDefaultSingleItemMsgBuilder().withGUID().withLikes(0).get();
			wrapper.setProps({ post });

			expect(wrapper.ref(COUNTER_ID).exists()).toBe(false);

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-favorite-heart-button-outline');
			expect(icon.attributes('color')).not.toBe('red');
		});
	});

	describe('Comments', () => {
		const COUNTER_ID = 'comments-count';
		const ICON_ID = 'comments-icon';

		it('should not display counter if no comments', () => {
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
			expect(counter.text()).toBe(wrapper.vm.short(post.comments.messages.length));

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-chat-message-oval-outlined-speech-bubble');
		});
	});

	describe('Outfits', () => {
		const COUNTER_ID = 'outfits-count';
		const ICON_ID = 'hanger-icon';

		it('should not display counter if no outfits', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().get();

			wrapper.setProps({ post });

			expect(wrapper.ref(COUNTER_ID).exists()).toBe(false);

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-hanger');
		});

		it('should display number of outfits', () => {
			const post = aDefaultSingleItemMsgBuilder().withGUID().get();
			post.item.outfits = chance.natural();
			wrapper.setProps({ post });

			const counter = wrapper.ref(COUNTER_ID);
			expect(counter.exists()).toBe(true);
			expect(counter.text()).toBe(wrapper.vm.short(post.item.outfits));

			const icon = wrapper.ref(ICON_ID);
			expect(icon.text()).toBe('sqdi-hanger');
		});
	});
});
