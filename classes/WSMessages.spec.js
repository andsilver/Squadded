import { Chance } from 'chance';
import { flushPromises } from '~/helpers';
import { WSMessages } from '~/classes/WSMessages';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedGetters, FeedMutations } from '~/store/feed';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { PostActions, PostGetters, PostStore, PostMutations } from '~/store/post';
import { UserStore, UserMutations } from '~/store/user';
import { ExploreStore, ExploreMutations } from '~/store/explore';
import { userMockBuilder } from '~/test/user.mock';
import TestPoll from '~/test/testpool.json';
import TestAcceptSquad from '~/test/test-accept-squad.json';
import { notifyVote } from '~/test/notifications.mock';
import { HomeStore, HomeMutations } from '~/store/home';

const chance = new Chance();

describe('WSMessages dispatch', () => {
	const STORE = {
		getters: {
			[`${FeedStore}/${FeedGetters.items}`]: [],
		},
		state: {
			feed: {
				items: [],
				allLoaded: false,
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
			activity: {
				guid: {},
				allLoaded: {},
			},
			home: {
				posts: null,
				watchers: [],
				interactions: [],
				public: [],
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

	it('should pong', () => {
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

	it('should accept top outfits', () => {
		const outfits = [{ post: {}, score: 10 }];
		const msg = {
			type: 'topOutfits',
			outfits,
		};
		const ts = 123456789;
		global.Date.now = jest.fn().mockReturnValue(ts);
		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${ExploreStore}/${ExploreMutations.setItems}`, {
			content: { items: outfits, ts },
			type: 'topOutfits',
		});
	});

	it('should accept top gallery', () => {
		const galleryPosts = [{ post: {}, score: 10 }];
		const msg = {
			type: 'topGallery',
			gallery: galleryPosts,
		};
		const ts = 123456789;
		global.Date.now = jest.fn().mockReturnValue(ts);
		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${ExploreStore}/${ExploreMutations.setItems}`, {
			content: { items: galleryPosts, ts },
			type: 'topGallery',
		});
	});

	it('should accept ending polls', () => {
		const endingPolls = [{ post: {}, score: 10 }];
		const msg = {
			type: 'endingPolls',
			endingPolls,
		};
		const ts = 123456789;
		global.Date.now = jest.fn().mockReturnValue(ts);
		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${ExploreStore}/${ExploreMutations.setItems}`, {
			content: { items: endingPolls, ts },
			type: 'endingPolls',
		});
	});

	it('should accept top items', () => {
		const topItems = [{}];
		const msg = {
			type: 'topItems',
			items: topItems,
		};
		const ts = 123456789;
		global.Date.now = jest.fn().mockReturnValue(ts);
		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${ExploreStore}/${ExploreMutations.setItems}`, {
			content: { items: topItems, ts },
			type: 'topItems',
		});
	});

	it('should accept bulk feed', async () => {
		const existing1 = { guid: 'existing1' };
		const feed = [{ guid: 'feed' }, existing1];
		const posts = [{ guid: 'posts' }];
		const msg = {
			type: 'feed',
			feed,
		};
		store.state.feed.items = [{ guid: 'existing' }, existing1];
		store.getters[`${PostStore}/${PostGetters.getPostByIdList}`] = jest.fn().mockReturnValue(posts);

		wsMessages.dispatch(msg);
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.receiveBulk}`, feed);
		await flushPromises();
		expect(store.getters[`${PostStore}/${PostGetters.getPostByIdList}`]).toHaveBeenCalledWith([
			'existing',
			'existing1',
			'feed',
		]);
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.setLoading}`, false);
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.setItems}`, posts);

		wsMessages.dispatch(msg);
		await flushPromises();
		expect(store.commit).toHaveBeenCalledWith(`${FeedStore}/${FeedMutations.markAllLoaded}`, feed);
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

	it('should increment likes counter on notifLike', () => {
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

	it('should update post and notifications on notifEndPoll', () => {
		const guid = chance.guid();
		const msg = {
			guid,
			type: 'notifEndPoll',
		};

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.add}`, msg);
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.receiveItem}`, { closed: true, guid });
	});

	it('should decrement likes counter on notifLike', () => {
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

	it('should add comment on notifComment', () => {
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

	it('should accept reactions of type likes', () => {
		const msg = {
			type: 'likes',
			likes: [{ iLike: true }],
		};

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.receiveReaction}`, msg.likes);
	});

	it('should accept reactions of type comments', () => {
		const msg = {
			type: 'comments',
			comments: [],
		};

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.receiveComments}`, msg);
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
		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.setListOfType}`, { posts, type, isMine: true });
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
		expect(store.commit).toHaveBeenCalledWith(`${ActivityStore}/${ActivityMutations.setListOfType}`, { posts: blog, type, isMine: true });
	});

	it(`should commit feedHome to ${HomeStore}/${HomeMutations.receive}`, async () => {
		const watchers = [{ user: {} }];
		const publicPosts = [{}];
		const interactions = [{ post: {}, score: 3 }];
		const all = [...watchers, ...publicPosts, ...interactions.map(p => p.post)];
		const type = 'feedHome';
		const interactionPage = 1;
		const msg = {
			type,
			watchers,
			public: publicPosts,
			interactions,
			interactionPage,
		};
		store.getters[`${PostStore}/${PostGetters.getPostsByIds}`] = jest.fn().mockReturnValue(all);

		wsMessages.dispatch(msg);
		await flushPromises();
		expect(store.dispatch).toHaveBeenCalledWith(`${PostStore}/${PostActions.receiveBulk}`, all);
		expect(store.commit).toHaveBeenCalledWith(`${HomeStore}/${HomeMutations.receive}`, {
			posts: all,
			watchers,
			publicPosts,
			interactions,
			interactionPage,
		});
		expect(store.commit).toHaveBeenCalledWith(`${HomeStore}/${HomeMutations.markAllLoaded}`, all);
	});

	it(`should commit notifications to ${NotificationStore}/${NotificationMutations.receive}`, () => {
		const notifications = ['list', 'of', 'notifications'];
		const msg = {
			type: 'notifications',
			notifications,
		};

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.receive}`, { notifications });
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

	it(`should commit pollResult to ${PostStore}/${PostMutations.setPollResult}`, () => {
		const pollResult = TestPoll;
		const msg = {
			type: 'pollResult',
			pollResult,
		};

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.setPollResult}`, pollResult);
	});

	it(`should commit post to ${PostStore}/${PostMutations.setCurrentPost}`, () => {
		const post = {};
		const msg = {
			type: 'post',
			post,
		};

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.setCurrentPost}`, post);
	});

	it('should commit notification on notifyAcceptSquad', () => {
		const msg = TestAcceptSquad;

		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.add}`, msg);
	});

	it('should commit setUploadingPicture with `violation`', () => {
		wsMessages.dispatch({ type: 'moderationFailed' });
		expect(store.commit).toHaveBeenCalledWith(`${PostStore}/${PostMutations.setUploadingPicture}`, 'violation');
	});

	it('should commit notification on notifyVote', () => {
		const msg = notifyVote;
		wsMessages.dispatch(msg);
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.add}`, msg);
	});
});
