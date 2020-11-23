import { Chance } from 'chance';

const chance = new Chance();

export const userMockBuilder = (isMe = false, influencer = false, guest = false, active = true) => {
	const userId = chance.guid();
	const name = chance.name();
	const user = {
		name,
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
		guid: userId,
		influencer,
		isMe,
		likes: chance.natural({ max: 10e6 }),
		mention: chance.twitter(),
		screenName: name,
		userId,
		private: chance.bool(),
		squaddersCount: chance.natural({ max: 10e6 }),
		nameSelected: chance.bool(),
		guest,
		active,
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
