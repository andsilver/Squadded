import { Chance } from 'chance';
import jwt from 'jsonwebtoken';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import user, { UserMutations, UserActions, UserStore } from './user';
import store from './index';
import { userMockBuilder } from '~/test/user.mock';

const chance = new Chance();

describe('User Store module', () => {
	let localVue;
	let userStore;
	let root;
	let $ws;

	beforeEach(() => {
		localStorage.clear();
		localVue = createLocalVue();
		localVue.use(Vuex);

		userStore = new Vuex.Store(user);

		$ws = { sendObj: jest.fn() };
		root = new Vuex.Store(store);
		root.state.socket.isConnected = true;
		root.state.merchant.id = 'aDummyMerchantId';
		root.state.socket.$ws = $ws;
	});

	it('should set me', () => {
		const me = userMockBuilder(true).get();
		userStore.commit(UserMutations.setMe, me);

		expect(userStore.state.me).toEqual(me);
	});

	it('should set follow', () => {
		const me = userMockBuilder(true).get();
		userStore.commit(UserMutations.setMe, me);
		const user = userMockBuilder().get();
		user.followers.me = false;
		const { count } = user.followers;
		const meFollowing = me.following.count;

		userStore.commit(UserMutations.setFollow, { follow: true, user });

		expect(user.followers.me).toBe(true);
		expect(user.followers.count).toBe(count + 1);
		expect(me.following.count).toBe(meFollowing + 1);
	});

	it('should unset follow', () => {
		const me = userMockBuilder(true).get();
		userStore.commit(UserMutations.setMe, me);
		const user = userMockBuilder().get();
		user.followers.me = true;
		const { count } = user.followers;
		const meFollowing = me.following.count;

		userStore.commit(UserMutations.setFollow, { follow: false, user });

		expect(user.followers.me).toBe(false);
		expect(user.followers.count).toBe(count - 1);
		expect(me.following.count).toBe(meFollowing - 1);
	});

	it('should not decrement below zero', () => {
		const user = userMockBuilder().get();
		user.followers.me = true;
		user.followers.count = 0;

		userStore.commit(UserMutations.setFollow, { follow: false, user });

		expect(user.followers.me).toBe(false);
		expect(user.followers.count).toBe(0);
	});

	it('should set other', () => {
		const other = userMockBuilder().get();
		userStore.commit(UserMutations.setOther, other);

		expect(userStore.state.other).toEqual(other);
	});

	it('should set token', () => {
		const userId = chance.guid();
		const userToken = jwt.sign({ sub: userId }, 'supersecret', { expiresIn: '1h' });
		userStore.commit(UserMutations.setToken, userToken);

		expect(localStorage.getItem('userToken')).toBe(userToken);
		expect(userStore.state.me.userId).toBe(userId);
	});

	it('should set user', async () => {
		const user = userMockBuilder().get();
		const bio = chance.sentence();
		const name = chance.first() + ' ' + chance.last();
		const _private = chance.bool();
		const avatar = chance.url();
		const nameSelected = chance.bool();
		user.bio = bio;
		user.private = _private;
		user.name = name;
		user.avatar = avatar;
		user.isMe = true;
		user.nameSelected = nameSelected;

		await root.dispatch(`${UserStore}/${UserActions.setProfile}`, user);

		expect(root.state.socket.$ws.sendObj).toHaveBeenCalledWith({
			type: 'setProfile',
			user: {
				bio,
				private: _private,
				name,
				avatar,
				nameSelected,
			},
		});

		expect(root.state.user.me.bio).toEqual(bio);
		expect(root.state.user.me.private).toEqual(_private);
		expect(root.state.user.me.name).toEqual(name);
		expect(root.state.user.me.avatar).toEqual(avatar);
		expect(root.state.user.me.nameSelected).toEqual(nameSelected);
	});
});
