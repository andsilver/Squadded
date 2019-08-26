import { Chance } from 'chance';

const chance = new Chance();

const aDefaultSingleItemMsgBuilder = () => {
	const msg = {
		type: 'singleItemPost',
		guid: null,
		correlationId: null,
		data: {
			merchantId: chance.natural(),
			item: {
				itemId: chance.natural(),
				title: chance.sentence({ words: 5 }),
				origPrice: chance.euro(),
				price: chance.euro(),
				img: chance.url({ extensions: ['jpg', 'png'] }),
				url: chance.url(),
			},
		},
	};

	const builder = {
		withId: (id) => {
			msg.id = id;
			return builder;
		},
		get: () => msg,
	};

	return builder;
};

export { aDefaultSingleItemMsgBuilder };
