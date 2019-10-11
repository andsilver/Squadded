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

	it('should set me', () => {
		const me = userMockBuilder().get();
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
