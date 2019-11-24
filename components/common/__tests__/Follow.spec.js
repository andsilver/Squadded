import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Follow from '../Follow.vue';
import Store from '~/store';
import { FeedStore, FeedMutations } from '~/store/feed';
import { UserStore, UserMutations } from '~/store/user';
import { userMockBuilder } from '~/test/user.mock';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Follow button', () => {
	const FOLLOW_BTN = 'follow-btn';
	let localVue;
	let store;
	let user;
	let wrapper;
	let $ws;

	function initLocalVue () {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		$ws = {
			sendObj: jest.fn(),
		};
		user = userMockBuilder().get();
		wrapper = shallowMount(Follow, {
			store,
			mocks: {
				$store: store,
				$t: msg => msg,
				$ws,
			},
			propsData: {
				user,
			},
		});
	}

	beforeEach(initLocalVue);

	it('should not allow follow to myself', () => {
		user.isMe = true;
		wrapper.vm.$forceUpdate();

		expect(wrapper.ref(FOLLOW_BTN).exists()).toBe(false);
		wrapper.vm.toggleFollow();
		expect($ws.sendObj).not.toHaveBeenCalled();
	});

	it('should allow to follow if not follower yet', () => {
		user.followers.me = false;
		wrapper.vm.$forceUpdate();

		const followBtn = wrapper.ref(FOLLOW_BTN);
		expect(followBtn.exists()).toBe(true);
		expect(followBtn.text()).toBe('user.Follow');

		spyOn(store, 'commit').and.callThrough();

		wrapper.vm.toggleFollow();
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'follow',
			guid: user.userId,
			follow: true,
		});
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.clear}`);
		expect(store.commit).toHaveBeenCalledWith(`${UserStore}/${UserMutations.setFollow}`, { follow: true, user });
		expect(user.followers.me).toBe(true);
	});

	it('should allow to unfollow if already a follower', () => {
		user.followers.me = true;
		wrapper.vm.$forceUpdate();

		const followBtn = wrapper.ref(FOLLOW_BTN);
		expect(followBtn.exists()).toBe(true);
		expect(followBtn.text()).toBe('user.Unfollow');

		spyOn(store, 'commit').and.callThrough();

		wrapper.vm.toggleFollow();
		expect($ws.sendObj).toHaveBeenCalledWith({
			type: 'follow',
			guid: user.userId,
			follow: false,
		});
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.clear}`);
		expect(store.commit).toHaveBeenCalledWith(`${UserStore}/${UserMutations.setFollow}`, { follow: false, user });
		expect(user.followers.me).toBe(false);
	});
});
