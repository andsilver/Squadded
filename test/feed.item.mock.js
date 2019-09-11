import { Chance } from 'chance';

const chance = new Chance();

const aDefaultSingleItemMsgBuilder = () => {
	const msg = {
		type: 'singleItemPost',
		guid: null,
		error: null,
		ts: null,
		correlationId: null,
		likes: 0,
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
			msg.correlationId = id || chance.guid();
			return builder;
		},
		withGUID: (id) => {
			msg.guid = id || chance.guid();
			return builder;
		},
		withLikes: (likes = chance.natural()) => {
			msg.likes = likes;
			return builder;
		},
		get: () => msg,
	};

	return builder;
};

export { aDefaultSingleItemMsgBuilder };
