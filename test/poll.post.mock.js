import { Chance } from 'chance';
import { FeedPost } from '../classes/FeedPost';
import { itemBuilder } from './item.mock';
import { commentMockBuilder } from './comment.mock';
import { userMockBuilder } from './user.mock';

const chance = new Chance();

const aDefaultPollMsgBuilder = () => {
	const item1 = itemBuilder().withVotes().get();
	const item2 = itemBuilder().withVotes().get();
	const msg = new FeedPost({
		item1,
		item2,
		type: 'pollPost',
	});

	const builder = {
		withCorrelationId: (id) => {
			msg.correlationId = id || chance.guid();
			return builder;
		},
		withGUID: (id) => {
			msg.guid = id || chance.guid();
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
			return builder;
		},
		withText: (text = chance.sentence()) => {
			msg.text = text;
			return builder;
		},
		withItem1Votes: (v) => {
			msg.item1.votes = v;
			return builder;
		},
		withItem2Votes: (v) => {
			msg.item2.votes = v;
			return builder;
		},
		isVoted: () => {
			msg.voted = true;

			return builder;
		},
		get: () => msg,
	};

	return builder;
};

export { aDefaultPollMsgBuilder };
