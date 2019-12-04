import { Chance } from 'chance';
import { flushPromises } from '~/helpers';
import { WSMessages } from '~/classes/WSMessages';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedGetters, FeedMutations } from '~/store/feed';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { PostActions, PostGetters, PostStore, PostMutations } from '~/store/post';
import { UserStore, UserMutations } from '~/store/user';
import { userMockBuilder } from '~/test/user.mock';

const chance = new Chance();

describe('WSMessages dispatch', () => {
	const STORE = {
		getters: {
			[`${FeedStore}/${FeedGetters.items}`]: [],
		},
		state: {
			feed: {
				items: [],
			},
			merchant: {
				id: null,
			},
			user: {
				me: {},
			},
			squad: {
				route: { path: '/default' },
			},
		},
	};
	let _ws;
	let store;
	let wsMessages;

	beforeEach(() => {
		const deepStore = JSON.parse(JSON.stringify(STORE));
		store = Object.assign({
			commit: jest.fn(),
			dispatch: jest.fn(),
			subscribe: jest.fn(),
		}, deepStore);
		_ws = {
			sendObj: jest.fn(),
		};
		store.state.socket = {
			_ws,
			$ws: _ws,
		};
		wsMessages = new WSMessages(store);
	});

	it(`should pong`, () => {
		const msg = {
			type: 'ping',
		};

		wsMessages.dispatch(msg);
		expect(_ws.sendObj).toHaveBeenCalledWith({ type: 'pong' });
	});

	['singleItemPost', 'pollPost', 'outfitPost'].forEach((type) => {
		it(`should handle ${type}`, async () => {
			const post = { mock: 'post' };
			const msg = {
				type,
			};
			store.dispatch.mockReturnValue(post);

			wsMessages.dispatch(msg);
			expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.receiveItem}`, msg);
			await flushPromises();
			expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.addItem}`, post);
		});
	});

	it(`should accept bulk feed`, async () => {
		const feed = ['somefeed'];
		const posts = ['someposts'];
		const msg = {
			type: 'feed',
			feed,
		};
		store.dispatch.mockReturnValue(posts);

		wsMessages.dispatch(msg);
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.receiveBulk}`, feed);
		await flushPromises();
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.addBulk}`, posts);
	});

	['followers', 'following'].forEach((type) => {
		it(`should setUserList of ${type}`, () => {
			const users = ['list', 'of', 'users'];
			const msg = {
				type,
				users,
			};

			wsMessages.dispatch(msg);
			expect(store.commit).toHaveBeenCalledWith(`${UserStore}/${UserMutations.setUserList}`, users);
		});
	});

	it(`should commit like to ${PostStore}/${PostMutations.setPostLike}`, () => {
		const guid = chance.guid();
		const byMe = true;
		const count = chance.natural();
		const msg = {
			guid,
			likes: { byMe, count },
			type: 'like',
		};
		const post = { type: 'sinleItemPost' };
		store.getters[`${PostStore}/${PostGetters.getPostById}`] = jest.fn().mockReturnValue(post);

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.setPostLike}`, { byMe, count, post });
	});

	it(`should increment likes counter on notifLike`, () => {
		const postId = chance.guid();
		const iLike = true;
		const msg = {
			iLike,
			postId,
			type: 'notifLike',
		};
		const post = { type: 'sinleItemPost' };
		store.getters[`${PostStore}/${PostGetters.getPostById}`] = jest.fn().mockReturnValue(post);

		wsMessages.dispatch(msg);
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.modifyLike}`, { mod: 1, post });
	});

	it(`should decrement likes counter on notifLike`, () => {
		const postId = chance.guid();
		const iLike = false;
		const msg = {
			iLike,
			postId,
			type: 'notifLike',
		};
		const post = { type: 'sinleItemPost' };
		store.getters[`${PostStore}/${PostGetters.getPostById}`] = jest.fn().mockReturnValue(post);

		wsMessages.dispatch(msg);
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.modifyLike}`, { mod: -1, post });
	});

	it(`should add comment on notifComment`, () => {
		const postId = chance.guid();
		const user = { any: 'authour' };
		const text = chance.sentence();
		const msg = {
			postId,
			text,
			type: 'notifComment',
			user,
		};
		const comment = {
			text,
			author: user,
		};
		const post = { type: 'sinleItemPost' };
		store.getters[`${PostStore}/${PostGetters.getPostById}`] = jest.fn().mockReturnValue(post);

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.addComment}`, { comment, post });
	});

	['comments', 'likes'].forEach((type) => {
		it(`should accept reactions of type ${type}`, () => {
			const reactions = {
				comments: [{ text: 'text' }],
				likes: [{ iLike: true }],
			};
			const msg = {
				type,
				[type]: reactions[type],
			};

			wsMessages.dispatch(msg);
			expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.receiveReaction}`, reactions[type]);
		});
	});

	it(`should commit visitor user to ${UserStore}/${UserMutations.setMe}`, () => {
		const user = userMockBuilder().get();
		const msg = {
			type: 'userProfile',
			user,
		};
		store.state.user.me.userId = user.userId;

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${UserStore}/${UserMutations.setMe}`, user);
	});

	it(`should commit other user to ${UserStore}/${UserMutations.setOther}`, () => {
		const user = userMockBuilder().get();
		const msg = {
			type: 'userProfile',
			user,
		};
		store.state.user.me.userId = 'myUserId';

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${UserStore}/${UserMutations.setOther}`, user);
	});

	it(`should commit wishlist to ${ActivityStore}/${ActivityMutations.setListOfType}`, async () => {
		const item = {
			itemId: 'some-item-id',
		};
		const wishlist = [{ item }];
		const type = 'wishlist';
		const msg = {
			type,
			wishlist,
		};
		const posts = [{ item, guid: item.itemId }];
		store.getters[`${PostStore}/${PostGetters.getPostByIdList}`] = jest.fn().mockReturnValue(posts);

		wsMessages.dispatch(msg);
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.receiveBulk}`, posts);
		await flushPromises();
		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.setListOfType}`, { posts, type });
	});

	it(`should commit blog to ${ActivityStore}/${ActivityMutations.setListOfType}`, async () => {
		const blog = ['somedata'];
		const type = 'blog';
		const msg = {
			type,
			blog,
		};
		store.getters[`${PostStore}/${PostGetters.getPostByIdList}`] = jest.fn().mockReturnValue(blog);

		wsMessages.dispatch(msg);
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.receiveBulk}`, blog);
		await flushPromises();
		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.setListOfType}`, { posts: blog, type });
	});

	it(`should commit squadders to ${ActivityStore}/${ActivityMutations.setListOfType}`, async () => {
		const squadders = ['somedata'];
		const type = 'squadders';
		const msg = {
			type,
			squadders,
		};
		store.getters[`${PostStore}/${PostGetters.getPostByIdList}`] = jest.fn().mockReturnValue(squadders);

		wsMessages.dispatch(msg);
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.receiveBulk}`, squadders);
		await flushPromises();
		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.setListOfType}`, { posts: squadders, type });
	});

	it(`should commit notifications to ${NotificationStore}/${NotificationMutations.receive}`, () => {
		const notifications = ['list', 'of', 'notifications'];
		const msg = {
			type: 'notifications',
			notifications,
		};

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.receive}`, notifications);
	});

	it(`should dispatch resquadded to ${PostStore}/${PostActions.updateResquadd}`, () => {
		const items = ['list', 'of', 'items'];
		const msg = {
			type: 'resquadded',
			items,
		};

		wsMessages.dispatch(msg);
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.updateResquadd}`, items);
	});
});
