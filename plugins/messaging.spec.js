import messaging, { parseMessage } from './messaging';

describe('Message listener', () => {
	it('should add event listener', () => {
		spyOn(window, 'addEventListener');

		messaging({ store: {} });

		expect(window.addEventListener).toHaveBeenCalledTimes(1);
		expect(window.addEventListener).toHaveBeenCalledWith('message', parseMessage);
	});

	it('should dispatch save on receive new Feed item', () => {
		const store = {
			dispatch: function () {}, // do not use arrow function
		};
		spyOn(store, 'dispatch');
		messaging({ store });

		const data = {
			type: 'FEED_ITEM',
			item: {
				name: 'singleItemPost',
				data: {
					title: 'Title',
					price: '9.99$',
					img: 'http://mock/img.png',
					url: 'http://mock/item',
				},
			},
		};

		parseMessage({ data: JSON.stringify(data) });

		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch.calls.argsFor(0)).toEqual(['feed/saveItem', data.item]);
	});
});
