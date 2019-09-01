import { Chance } from 'chance';

const chance = new Chance();

const aDefaultSingleItemMsgBuilder = () => {
	const msg = {
		type: 'singleItemPost',
		guid: null,
		correlationId: null,
		merchantId: chance.natural(),
		item: {
			itemId: chance.natural(),
			title: chance.sentence({ words: 5 }),
			origPrice: chance.euro(),
			price: chance.euro(),
			img: chance.url({ extensions: ['jpg', 'png'] }),
			url: chance.url(),
		},
	};

	const builder = {
		withCorrelationId: (id) => {
			msg.correlationId = id;
			return builder;
		},
		get: () => msg,
	};

	return builder;
};

export { aDefaultSingleItemMsgBuilder };
