import { Chance } from 'chance';
import jwt from 'jsonwebtoken';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import user, { UserMutations } from './user';
import { userMockBuilder } from '~/test/user.mock';

const chance = new Chance();

describe('User Store module', () => {
	let localVue;
	let store;

	beforeEach(() => {
		localStorage.clear();
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(user);
	});

	it('should set follow', () => {
		const user = userMockBuilder().get();
		user.followers.me = false;
		const { count } = user.followers;

		store.commit(UserMutations.setFollow, { follow: true, user });

		expect(user.followers.me).toBe(true);
		expect(user.followers.count).toBe(count + 1);
	});

	it('should unset follow', () => {
		const user = userMockBuilder().get();
		user.followers.me = true;
		const { count } = user.followers;

		store.commit(UserMutations.setFollow, { follow: false, user });

		expect(user.followers.me).toBe(false);
		expect(user.followers.count).toBe(count - 1);
	});

	it('should not decrement below zero', () => {
		const user = userMockBuilder().get();
		user.followers.me = true;
		user.followers.count = 0;

		store.commit(UserMutations.setFollow, { follow: false, user });

		expect(user.followers.me).toBe(false);
		expect(user.followers.count).toBe(0);
	});

	it('should set me', () => {
		const me = userMockBuilder(true).get();
		store.commit(UserMutations.setMe, me);

		expect(store.state.me).toEqual(me);
	});

	it('should set other', () => {
		const other = userMockBuilder().get();
		store.commit(UserMutations.setOther, other);

		expect(store.state.other).toEqual(other);
	});

	it('should set token', () => {
		const userId = chance.guid();
		const userToken = jwt.sign({ sub: userId }, 'supersecret', { expiresIn: '1h' });
		store.commit(UserMutations.setToken, userToken);

		expect(localStorage.getItem('userToken')).toBe(userToken);
		expect(store.state.me.userId).toBe(userId);
	});
});
