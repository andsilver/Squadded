import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Comments from '../../index.vue';
import Store from '~/store';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { flushPromises } from '~/helpers';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { userMockBuilder } from '~/test/user.mock';
import { commentMockBuilder } from '~/test/comment.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Comments', () => {
	const COMMENTS_LIST = 'comments-list';
	const COMMENT_INPUT = 'comment-input';

	let localVue;
	let post;
	let postBld;
	let store;
	let wrapper;
	let showAll = true;

	function mount () {
		wrapper = shallowMount(Comments, {
			localVue,
			mocks: {
				$t: msg => msg,
			},
			propsData: {
				post,
				showAll,
			},
			store,
		});
	}

	function initLocalVue () {
		postBld = aDefaultSingleItemMsgBuilder().withComment();
		post = postBld.get();
		post.comments.messages = [];

		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		mount();
	}

	beforeEach(() => {
		initLocalVue();
	});

	it('should not display comments list when no comments', () => {
		const comments = wrapper.ref(COMMENTS_LIST);
		expect(comments.exists()).toBe(false);
	});

	it('should fetch comments on create', async () => {
		const user = userMockBuilder().short();

		const comments = [{
			author: user,
			isMe: true,
		}];
		const $ws = {
			sendObj: jest.fn(),
		};
		store.state.socket.$ws = $ws;
		store.commit('SET_SOCKET_AUTH', true);

		mount();
		await flushPromises();
		store.commit(`${PostStore}/${PostMutations.resetComments}`, { comments, post, myUserId: user.guid });
		await flushPromises();

		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'fetchComments',
			guid: post.guid,
		});
		expect(post.comments.messages).toEqual(comments);
	});

	it('should display comments list', () => {
		postBld.withComment();
		wrapper.vm.$forceUpdate();

		const comments = wrapper.ref(COMMENTS_LIST);
		expect(comments.exists()).toBe(true);
	});

	it('should display input comment element and set correct props', () => {
		const comments = wrapper.ref(COMMENT_INPUT);
		expect(comments.exists()).toBe(true);
		expect(comments.props('post')).toBe(post);
		expect(comments.props('action')).toBe(`${PostStore}/${PostActions.sendComment}`);
	});

	it('should showAll button and should show all on click', async () => {
		const comments = new Array(5).fill(commentMockBuilder().get());
		post.comments.messages = comments;
		showAll = false;
		mount();
		await flushPromises();
		const showAllBtn = wrapper.ref('show-all-btn');
		expect(showAllBtn.exists()).toBe(true);
		showAllBtn.trigger('click');
		expect(wrapper.vm.showAllComments).toBe(true);
		expect(wrapper.ref(COMMENTS_LIST).exists()).toBe(true);
	});
});
