import { Chance } from 'chance';

const chance = new Chance();

export const userMockBuilder = () => {
	const user = {
		name: chance.name(),
		avatar: chance.avatar(),
		bio: 'Fassion is my obsession',
		blog: [],
		following: {
			count: chance.natural({ max: 10e5 }),
		},
		followers: {
			count: chance.natural({ max: 10e6 }),
			me: chance.bool(),
		},
		likes: chance.natural({ max: 10e6 }),
		mention: chance.twitter(),
		userId: chance.guid(),
	};

	const builder = {
		get: () => user,
		short: () => ({
			guid: user.userId,
			userId: user.userId,
			screenName: user.name,
			avatar: user.avatar,
		}),
	};

	return builder;
};
