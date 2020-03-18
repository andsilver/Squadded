import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import PopMenu from '../PopMenu.vue';
import Store from '~/store';
import { aDefaultSingleItemMsgBuilder } from '~/test/feed.item.mock';
import { PostStore, PostActions } from '~/store/post';
import { FeedMutations, FeedStore } from '~/store/feed';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { PairedItemStore, PairedItemMutations } from '~/store/paired-item';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { HomeStore, HomeMutations } from '~/store/home';
import { BANNER_TIMEOUT } from '~/consts';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('PopMenu', () => {
	const CLOSE = 'close';
	const SHARELINK = 'sharelink';
	const TOGGLE = 'toggle';
	const EDIT = 'edit';
	const DELETE = 'delete';
	const REPORT = 'report';
	const ADD = 'add';
	const REMOVE = 'remove';
	const SHARE_POST_MODAL = 'share-post-modal';
	const CLOSE_ICON_BTN_REPORT_DIALOG = 'close-btn-report-dialog';
	const CLOSE_BTN_REPORT_DIALOG = 'close-btn-report-dialog';
	const REPORT_BTN = 'report-btn';

	let wrapper;
	let store;
	let localVue;
	const post = aDefaultSingleItemMsgBuilder().get();
	const $root = {
		$emit: jest.fn(),
	};
	const $ws = {
		sendObj: jest.fn(),
	};
	const $router = {
		push: jest.fn(),
	};

	const initLocalVue = () => {
		wrapper = shallowMount(PopMenu, {
			localVue,
			store,
			propsData: {
				post,
			},
			mocks: {
				$t: msg => msg,
				$root,
				$ws,
				$router,
			},
		});
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.commit = jest.fn();
		store.dispatch = jest.fn();
		global.Date.now = jest.fn().mockReturnValue(123456789);
	});

	it('should render correct items in case of the post is mine', () => {
		post.byMe = true;
		initLocalVue();
		expect(wrapper.ref(CLOSE).exists()).toBe(true);
		expect(wrapper.ref(SHARELINK).exists()).toBe(true);
		expect(wrapper.ref(TOGGLE).exists()).toBe(true);
		expect(wrapper.ref(EDIT).exists()).toBe(true);
		expect(wrapper.ref(DELETE).exists()).toBe(true);
	});

	it('should render correct items in case of post is not mine and he\'s not in my squad', () => {
		post.byMe = false;
		initLocalVue();
		expect(wrapper.ref(REPORT).exists()).toBe(true);
		expect(wrapper.ref(ADD).exists()).toBe(true);
	});

	it('should render correct items in case of post is not mine, owner is in my squad and i am following the owner', () => {
		post.user.followed = true;
		post.user.mysquad = true;
		post.byMe = false;
		initLocalVue();
		expect(wrapper.ref(REMOVE).exists()).toBe(true);
	});

	it('should render share post dialog on click share', () => {
		initLocalVue();
		wrapper.ref(SHARELINK).trigger('click');
		expect(wrapper.ref(SHARE_POST_MODAL).exists()).toBe(true);
	});

	it('should render report dialog and perform correct actions', () => {
		post.byMe = false;
		post.postId = 'anyId';
		initLocalVue();
		wrapper.ref(REPORT).trigger('click');
		expect(wrapper.vm.showReasonDialog).toBe(true);
		wrapper.ref(CLOSE_ICON_BTN_REPORT_DIALOG).trigger('click');
		expect(wrapper.vm.showReasonDialog).toBe(false);
		wrapper.ref(REPORT).trigger('click');
		expect(wrapper.vm.showReasonDialog).toBe(true);
		wrapper.ref(CLOSE_BTN_REPORT_DIALOG).trigger('click');
		expect(wrapper.vm.showReasonDialog).toBe(false);
		wrapper.ref(REPORT).trigger('click');
		const reason = 'other';
		const other = 'otherreason';
		wrapper.setData({ reason, other });
		wrapper.ref(REPORT_BTN).trigger('click');
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.reportPost}`, {	post, reason, other });
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.removePost}`, post.postId);
		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.removePost}`, post.postId);
		expect(store.commit).toHaveBeenCalledWith(`${PairedItemStore}/${PairedItemMutations.removePost}`, post.postId);
		expect(store.commit).toHaveBeenCalledWith(`${HomeStore}/${HomeMutations.removePost}`, post.postId);
	});

	it('should toggle private', () => {
		post.private = false;
		post.byMe = true;
		initLocalVue();
		jest.useFakeTimers();
		wrapper.ref(TOGGLE).trigger('click');
		jest.advanceTimersByTime(BANNER_TIMEOUT);
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.add}`, {
			type: 'notifAlert',
			alertType: 'setprivate',
			text: 'Only your followers can see your post now',
			post,
			ts: 123456789,
			_id: 123456789,
		});
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.updatePrivate}`, { post, private: true });
	});

	it('should edit post', () => {
		post.byMe = true;
		initLocalVue();
		wrapper.vm.$emit = jest.fn();
		wrapper.ref(EDIT).trigger('click');
		expect(wrapper.vm.$emit).toHaveBeenCalledWith('edit');
	});

	it('should delete post', () => {
		post.byMe = true;
		post.postId = 'anyId';
		initLocalVue();
		jest.useFakeTimers();
		wrapper.ref(DELETE).trigger('click');
		expect(wrapper.vm.showDeleteDialog).toBe(true);
		wrapper.ref('delete-post-btn').trigger('click');
		jest.advanceTimersByTime(BANNER_TIMEOUT);
		expect(wrapper.vm.$ws.sendObj).toHaveBeenCalledWith({
			type: 'deletePost',
			postId: post.postId,
		});
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.removePost}`, post.postId);
		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.removePost}`, post.postId);
		expect(store.commit).toHaveBeenCalledWith(`${HomeStore}/${HomeMutations.removePost}`, post.postId);
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.add}`, {
			type: 'notifAlert',
			alertType: 'checkmark',
			text: 'Your post has been deleted',
			post,
			ts: 123456789,
			_id: 123456789,
		});
	});

	it('should send invite to the user', () => {
		post.user.mysquad = false;
		post.byMe = false;
		initLocalVue();
		store.state.socket.isAuth = true;
		wrapper.ref(ADD).trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'acceptSquad',
			targetUserId: post.user.guid || post.user.userId,
		});
	});
});
