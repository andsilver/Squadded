import { Chance } from 'chance';
import fetchMock from 'fetch-mock';
import Vue from 'vue';
import { FeedStore, FeedActions } from '../store/feed';
import messaging, { dispatch } from './messaging';

const chance = new Chance();

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

	it('should dispatch save on receive new Feed item', () => {
		const store = {
			dispatch: function () {}, // do not use arrow function
		};
		spyOn(store, 'dispatch');

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
		expect(store.dispatch.calls.argsFor(0)).toEqual([`${FeedStore}/${FeedActions.saveItem}`, msg]);
	});

	it('should connect after login', () => {
		const store = {
			state: {
				merchant: {
					id: 'someMerchantId',
				},
			},
		};
		const userToken = chance.guid();

		Vue.prototype.$connect = function () {};
		spyOn(Vue.prototype, '$connect');

		dispatch(store, {
			type: 'loggedIn',
			userToken,
		});
		expect(Vue.prototype.$connect).toHaveBeenCalledTimes(1);
		expect(localStorage.getItem('userToken')).toBe(userToken);
	});
});

describe('Listen merchant id', () => {
	const store = {
		commit: function () {},
	};
	const msg = {
		type: 'injectMerchantId',
		merchantId: 'aMerchantId',
	};

	beforeEach(() => {
		spyOn(store, 'commit');
	});
	afterEach(fetchMock.reset);

	it('should commit merchant id', () => {
		dispatch(store, msg);

		expect(store.commit).toHaveBeenCalledTimes(1);
		expect(store.commit.calls.argsFor(0)).toEqual(['SET_MERCHANT_ID', msg.merchantId]);
	});
});
