import fetchMock from 'fetch-mock';
import merchant from '../services/merchant';
import messaging, { context } from './messaging';

const { API_LINK } = process.env;

describe('Message listener', () => {
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

		const event = {
			data: JSON.stringify(msg),
		};

		context({ store })(event);

		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch.calls.argsFor(0)).toEqual(['feed/saveItem', msg]);
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
	const event = {
		data: JSON.stringify(msg),
	};

	beforeEach(() => {
		spyOn(store, 'commit');
		spyOn(merchant, 'validateAllowedOrigins').and.callThrough();
	});
	afterEach(fetchMock.reset);

	it('should set state forbidden if origin not allowed for merchantId', async (done) => {
		window.location.ancestorOrigins = ['http://not.allowed.com'];

		fetchMock.get(`${API_LINK}/merchant/${msg.merchantId}/origins`, {
			status: 200,
			body: {
				list: ['http://allowed.com'],
			},
		});
		const promise = context({ store })(event);

		expect(merchant.validateAllowedOrigins).toHaveBeenCalledTimes(1);

		try {
			await promise;
		} catch (error) {
			expect(error).toEqual(new Error('Forbidden'));
		}

		expect(store.commit).toHaveBeenCalledTimes(1);
		expect(store.commit.calls.argsFor(0)).toEqual(['SET_MERCHANT_FORBIDDEN', true]);

		done();
	});

	it('should not forbidden if origin not allowed for merchantId', async (done) => {
		window.location.ancestorOrigins = ['http://allowed.com'];

		fetchMock.get(`${API_LINK}/merchant/${msg.merchantId}/origins`, {
			status: 200,
			body: {
				list: ['http://allowed.com'],
			},
		});

		const promise = context({ store })(event);

		expect(merchant.validateAllowedOrigins).toHaveBeenCalledTimes(1);

		try {
			await promise;
		} catch (error) {
			expect(error).not.toEqual(new Error('Forbidden'));
		}

		expect(store.commit).toHaveBeenCalledTimes(1);
		expect(store.commit.calls.argsFor(0)).toEqual(['SET_MERCHANT_ID', msg.merchantId]);

		done();
	});
});
