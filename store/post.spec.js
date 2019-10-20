import { Chance } from 'chance';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { aDefaultSingleItemMsgBuilder } from '../test/feed.item.mock';
import { commentsMsgBuilder } from '../test/comment.mock';
import { PostStore, PostActions, mutations } from './post';
import store from './index';
import { userMockBuilder } from '~/test/user.mock';

const chance = new Chance();

describe('Comment store module', () => {
	const { resetComments } = mutations;
	let root;
	let $ws;

	beforeEach(() => {
		const localVue = createLocalVue();
		localVue.use(Vuex);
		$ws = { sendObj: jest.fn() };
		root = new Vuex.Store(store);
		root.state.socket.isConnected = true;
		root.state.merchant.id = 'aDummyMerchantId';
		root.state.socket.$ws = $ws;
	});

	it('should update post comments', () => {
		const post = aDefaultSingleItemMsgBuilder().get();
		const { comments } = commentsMsgBuilder(post.guid).get();

		resetComments({}, { comments, post });

		expect(post.comments.messages).toBe(comments);
	});

	it('should send comment to ws and update post', async () => {
		const me = userMockBuilder();
		root.state.user.me = me;

		const guid = chance.guid();
		const post = aDefaultSingleItemMsgBuilder()
			.withGUID(guid)
			.get();

		const text = chance.sentence();
		const comment = {
			post,
			text,
		};

		await root.dispatch(`${PostStore}/${PostActions.sendComment}`, comment);

		const sendObjInvocationArg = $ws.sendObj.mock.calls[0][0];
		expect(sendObjInvocationArg).toMatchObject({
			guid,
			text,
			type: 'addComment',
		});
		expect(post.comments).toEqual({
			count: 1,
			messages: [ {
				author: me.short(),
				ts: jasmine.any(Number),
				text: comment.text,
			} ],
		});
	});
});
