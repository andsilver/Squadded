import { Chance } from 'chance';

const chance = new Chance();

export const commentMockBuilder = () => {
	const comment = {
		author: {
			name: chance.name(),
			avatar: chance.avatar(),
		},
		ts: Date.now(),
		text: chance.sentence(),
	};

	return {
		get: () => comment,
	};
};

export const commentsMsgBuilder = (guid = chance.guid()) => {
	const msg = {
		type: 'comments',
		guid,
		comments: [commentMockBuilder().get()],
	};

	return {
		get: () => msg,
	};
};
