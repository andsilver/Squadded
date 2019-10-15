import { Chance } from 'chance';
import fetchMock from 'fetch-mock';
import jwt from 'jsonwebtoken';
import Vue from 'vue';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { FeedStore, FeedActions } from '../store/feed';
import messaging, { dispatch } from './messaging';
import store from '@/store/index';
import { SquadStore, SquadMutations } from '~/store/squad';

describe('Message listener', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should add event listener', () => {
		spyOn(window, 'addEventListener');

		messaging({ store: {} });

		const func = window.addEventListener.calls.argsFor(0)[1];
		expect(window.addEventListener).toHaveBeenCalledTimes(1);
		expect(window.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
		expect(func.name).toBe('parseMessage');
	});
});

describe('Dispatcher', () => {
	let store;

	beforeEach(() => {
		localStorage.clear();
		store = {
			commit: jest.fn(),
			dispatch: jest.fn(),
		};
	});

	afterEach(fetchMock.reset);

	it('should dispatch save on receive new Feed item', () => {
		const msg = {
			type: 'singleItemPost',
			merchantId: 'aMerchantId',
			item: {
				itemId: 'anItemId',
				title: 'aTitle',
				price: 'aPrice',
				origPrice: 'anOrigPrice',
				img: 'anImgUrl',
				url: 'aProductUrl',
			},
		};

		dispatch(store, msg);

		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch).toHaveBeenCalledWith(`${FeedStore}/${FeedActions.saveItem}`, msg);
	});

	it('should commit merchant id', () => {
		const msg = {
			type: 'injectMerchantId',
			merchantId: 'aMerchantId',
		};

		dispatch(store, msg);

		expect(store.commit).toHaveBeenCalledTimes(1);
		expect(store.commit).toHaveBeenCalledWith('SET_MERCHANT_ID', msg.merchantId);
	});

	it('should commit squad params', () => {
		const msg = {
			type: 'injectSquadParams',
			squad: 'user:someId',
		};

		dispatch(store, msg);

		expect(store.commit).toHaveBeenCalledTimes(1);
		expect(store.commit).toHaveBeenCalledWith(`${SquadStore}/${SquadMutations.setSquadParams}`, msg.squad);
	});
});

describe('Login', () => {
	const chance = new Chance();
	const localVue = createLocalVue();
	localVue.use(Vuex);

	it('should connect after login', () => {
		const root = new Vuex.Store(store);
		const userToken = jwt.sign({ sub: chance.guid() }, 'supersecret', { expiresIn: '1h' });

		Vue.prototype.$connect = jest.fn();

		root.state.merchant.id = 'someMerchantId';
		dispatch(root, {
			type: 'loggedIn',
			userToken,
		});
		expect(Vue.prototype.$connect).toHaveBeenCalledTimes(1);
		expect(localStorage.getItem('userToken')).toBe(userToken);
	});
});
