import { Chance } from 'chance';
const chance = new Chance();

export const itemBuilder = () => {
	const item = {
		itemId: chance.natural(),
		title: chance.sentence({ words: 5 }),
		origPrice: chance.natural(),
		price: chance.natural(),
		currency: '€',
		img: chance.url({ extensions: ['jpg', 'png'] }),
		url: chance.url(),
		varId: '',
	};

	const builder = {
		withVotes: () => {
			item.votes = chance.integer({ min: 0, max: 10000 });
			return builder;
		},
		get: () => item,
	};
	return builder;
};
