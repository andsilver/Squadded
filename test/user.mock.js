import { Chance } from 'chance';
import { User } from '~/services/User';

const chance = new Chance();

export const userMockBuilder = () => {
	const user = new User({
		name: chance.name(),
		avatar: chance.avatar(),
		bio: 'Fassion is my obsession',
		mention: chance.twitter(),
		following: chance.natural({ max: 10e5 }),
		followers: {
			count: chance.natural({ max: 10e6 }),
			me: chance.bool(),
		},
		likes: chance.natural({ max: 10e6 }),
	});

	return {
		get: () => user,
	};
};
