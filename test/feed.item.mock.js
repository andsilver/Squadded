import { Chance } from 'chance';

const chance = new Chance();

export default function generateFeedItem () {
	return {
		merchantId: chance.natural(),
		itemId: chance.natural(),
		title: chance.sentence({ words: 5 }),
		price: chance.euro(),
		img: chance.url({ extensions: ['jpg', 'png'] }),
		url: chance.url(),
	};
};
