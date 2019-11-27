import { Chance } from 'chance';
import { FeedPost } from '../classes/FeedPost';
import { commentMockBuilder } from './comment.mock';
import { userMockBuilder } from './user.mock';

const chance = new Chance();

const aDefaultSingleItemMsgBuilder = () => {
	const item = {
		itemId: chance.natural(),
		title: chance.sentence({ words: 5 }),
		origPrice: chance.euro(),
		price: chance.euro(),
		img: chance.url({ extensions: ['jpg', 'png'] }),
		url: chance.url(),
		varId: '',
	};
	const post = {
		byMe: false,
		userId: null,
		private: false,
	};
	const msg = new FeedPost({ ...post, item, type: 'singleItemPost' });

	const builder = {
		withCorrelationId: (id) => {
			msg.correlationId = id || chance.guid();
			return builder;
		},
		withGUID: (id) => {
			msg.guid = id || chance.guid();
			msg.postId = msg.guid;
			return builder;
		},
		withLikes: (count = chance.natural(), byMe) => {
			msg.likes = {
				count,
				byMe,
			};
			return builder;
		},
		withComment: (comments = [commentMockBuilder().get()]) => {
			msg.comments = {
				count: comments.length,
				messages: comments,
			};
			return builder;
		},
		withUser: (user = userMockBuilder().short()) => {
			msg.user = user;
			msg.userId = user.guid;
			return builder;
		},
		withText: (text = chance.sentence()) => {
			msg.text = text;
			return builder;
		},
		get: () => msg,
	};

	return builder;
};

export { aDefaultSingleItemMsgBuilder };
