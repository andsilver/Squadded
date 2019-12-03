import { Chance } from 'chance';

const chance = new Chance();

export const commentMockBuilder = () => {
	const comment = {
		author: {
			name: chance.name(),
			avatar: chance.avatar(),
			isMe: false,
		},
		ts: Date.now(),
		text: chance.sentence(),
		id: chance.guid(),
	};

	const builder = {
		withByMe: (byMe) => {
			comment.author.isMe = byMe;
			return builder;
		},
		get: () => comment,
	};

	return builder;
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
