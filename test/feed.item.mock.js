import { Chance } from 'chance';

const chance = new Chance();

export default function generateFeedItem () {
	return {
		name: 'singleItemPost',
		id: chance.natural(),
		data: {
			title: chance.sentence({ words: 5 }),
			price: chance.euro(),
			img: chance.url({ extensions: ['jpg', 'png'] }),
			url: chance.url(),
		},
	};
};
