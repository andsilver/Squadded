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

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

class MockDate {}

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
			},
		});
	};

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.commit = jest.fn();
		store.dispatch = jest.fn();
		global.Date = MockDate;
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

	it('should render share post dialog on click share', async () => {
		initLocalVue();
		await wrapper.ref(SHARELINK).trigger('click');
		expect(wrapper.ref(SHARE_POST_MODAL).exists()).toBe(true);
	});

	it('should render report dialog and perform correct actions', async () => {
		post.byMe = false;
		post.postId = 'anyId';
		initLocalVue();
		await wrapper.ref(REPORT).trigger('click');
		expect(wrapper.vm.showReasonDialog).toBe(true);
		await wrapper.ref(CLOSE_ICON_BTN_REPORT_DIALOG).trigger('click');
		expect(wrapper.vm.showReasonDialog).toBe(false);
		await wrapper.ref(REPORT).trigger('click');
		expect(wrapper.vm.showReasonDialog).toBe(true);
		await wrapper.ref(CLOSE_BTN_REPORT_DIALOG).trigger('click');
		expect(wrapper.vm.showReasonDialog).toBe(false);
		await wrapper.ref(REPORT).trigger('click');
		const reason = 'other';
		const other = 'otherreason';
		wrapper.setData({ reason, other });
		await wrapper.ref(REPORT_BTN).trigger('click');
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.reportPost}`, {	post, reason, other });
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.removePost}`, post.postId);
		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.removePost}`, post.postId);
		expect(store.commit).toHaveBeenCalledWith(`${PairedItemStore}/${PairedItemMutations.removePost}`, post.postId);
		expect(store.commit).toHaveBeenCalledWith(`${HomeStore}/${HomeMutations.removePost}`, post.postId);
	});

	it('should toggle private', async () => {
		post.private = false;
		post.byMe = true;
		initLocalVue();
		await wrapper.ref(TOGGLE).trigger('click');
		setTimeout(() => {
			expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.add}`, {
				type: 'notifAlert',
				alertType: 'setpublic',
				text: 'Anyone can see your post now',
				ts: new MockDate(),
				_id: new MockDate(),
			});
			expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.updatePrivate}`, { post, private: false });
		}, 50);
	});

	it('should edit post', async () => {
		post.byMe = true;
		initLocalVue();
		wrapper.vm.$emit = jest.fn();
		await wrapper.ref(EDIT).trigger('click');
		expect(wrapper.vm.$emit).toHaveBeenCalledWith('edit');
	});

	it('should delete post', async () => {
		post.byMe = true;
		post.postId = 'anyId';
		initLocalVue();
		await wrapper.ref(DELETE).trigger('click');
		expect(wrapper.vm.showDeleteDialog).toBe(true);
		await wrapper.ref('delete-post-btn').trigger('click');
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
			ts: new MockDate(),
			_id: new MockDate(),
		});
	});

	it('should send invite to the user', async () => {
		post.user.mysquad = false;
		post.byMe = false;
		initLocalVue();
		await wrapper.ref(ADD).trigger('click');
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'acceptSquad',
			targetUserId: post.user.guid || post.user.userId,
		});
	});
});
