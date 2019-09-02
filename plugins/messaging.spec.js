import messaging, { context } from './messaging';

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
