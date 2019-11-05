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
		const other = userMockBuilder().get();
		other.followers.me = false;
		const { count } = other.followers;

		store.commit(UserMutations.setFollow, { follow: true, other });

		expect(other.followers.me).toBe(true);
		expect(other.followers.count).toBe(count + 1);
	});

	it('should unset follow', () => {
		const other = userMockBuilder().get();
		other.followers.me = true;
		const { count } = other.followers;

		store.commit(UserMutations.setFollow, { follow: false, other });

		expect(other.followers.me).toBe(false);
		expect(other.followers.count).toBe(count - 1);
	});

	it('should not decrement below zero', () => {
		const other = userMockBuilder().get();
		other.followers.me = true;
		other.followers.count = 0;

		store.commit(UserMutations.setFollow, { follow: false, other });

		expect(other.followers.me).toBe(false);
		expect(other.followers.count).toBe(0);
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
