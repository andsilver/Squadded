import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Comment from '../Comment.vue';
import Store from '~/store';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';

const mocks = {
	$t: msg => msg,
	$tc: msg => msg,
};

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Post comment', () => {
	const COMMENT_AUTHOR_USER_LINK = 'comment-author-user-link';
	const COMMENT_AUTHOR_NAME_USER_LINK = 'comment-author-name-user-link';
	const COMMENT_TEXT_ELEMENT = 'comment-text';
	let localVue;
	let wrapper;
	let store;

	function initLocalVue () {
		const post = aDefaultSingleItemMsgBuilder().withGUID().withComment().get();

		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);

		wrapper = shallowMount(Comment, {
			localVue,
			mocks,
			propsData: {
				comment: post.comments.messages[0],
			},
			store,
		});
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should have user links', () => {
		expect(wrapper.ref(COMMENT_AUTHOR_USER_LINK).exists()).toBe(true);
		expect(wrapper.ref(COMMENT_AUTHOR_NAME_USER_LINK).exists()).toBe(true);
	});

	it('display comment text', () => {
		const comment = wrapper.props().comment;

		expect(wrapper.ref(COMMENT_TEXT_ELEMENT).text()).toMatch(comment.text);
	});
});
