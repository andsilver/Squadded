import { ActivityStore, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { PostStore, PostActions, PostGetters, PostMutations } from '~/store/post';
import { UserStore, UserMutations } from '~/store/user';
import { PairedItemStore, PairedItemActions } from '~/store/paired-item';
import { ExploreStore, ExploreMutations } from '~/store/explore';
import { HomeStore, HomeMutations } from '~/store/home';
import { prefetch } from '~/helpers';
import { isMonoMerchant } from '~/utils/is-mono-merchant';

async function acceptPost(message) {
	const { id } = this.store.state.merchant;
	const items = [message.item, message.item1, message.item2, ...(message.items || [])];

	if (isMonoMerchant(this.store.state) && items.some(item => item && item.merchantId !== id)) {
		return;
	}
	if (!this.store.state.feed.items || !this.store.state.feed.items.length) {
		// tmp patch while infinite scroll not ready
		this.store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
	}
	const post = await this.store.dispatch(`${PostStore}/${PostActions.receiveItem}`, message);
	post && this.store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
	if (message.mysquad) {
		this.store.commit(`${FeedStore}/${FeedMutations.setNewPostsAvailable}`, true);
	}
}

async function activity (message) {
	const { type, userId } = message;
	const rawPostsList = message[type];
	if (type === 'wishlist') {
		if (rawPostsList.private) {
			this.store.state.activity.isPrivate = true;
			this.store.commit(`${ActivityStore}/${ActivityMutations.setListOfType}`, { posts: [], type });
			this.store.commit(`${ActivityStore}/${ActivityMutations.markAllLoaded}`, { loadedPosts: [], type });
			this.store.commit(`${ActivityStore}/${ActivityMutations.setLoading}`, { type, loading: false });
			return;
		}
		rawPostsList.forEach(w => (w.guid = w.item.itemId));
	}
	await this.store.dispatch(`${PostStore}/${PostActions.receiveBulk}`, rawPostsList);
	const existingItems = this.store.state.activity[type] || [];
	const uniqueIds = new Set([...existingItems, ...rawPostsList].map(p => p.guid));
	const getter = this.store.getters[`${PostStore}/${PostGetters.getPostByIdList}`];
	const posts = getter(Array.from(uniqueIds)).sort((a, b) => b.ts - a.ts);

	const isMine = this.store.state.user.me.userId === userId;
	this.store.commit(`${ActivityStore}/${ActivityMutations.setListOfType}`, { posts, type, isMine });
	this.store.commit(`${ActivityStore}/${ActivityMutations.markAllLoaded}`, { loadedPosts: rawPostsList, type });
	this.store.commit(`${ActivityStore}/${ActivityMutations.setLoading}`, { type, loading: false });
}

async function exploreItems (message) {
	const { type } = message;
	const innerType = type.replace('top', '');
	const lowercased = innerType.charAt(0).toLowerCase() + innerType.slice(1);
	const rawPosts = message[lowercased].map((p) => {
		if (p.post) {
			return {
				...p.post,
				guid: p.post._id,
				postId: p.post._id,
			};
		}
		if (!p.item) {
			return {
				...p,
				guid: p._id,
				postId: p._id,
			};
		}
		const { _id, ...item } = p.item;
		return {
			_id,
			postId: _id,
			guid: _id,
			item,
			type: 'singleItemPost',
		};
	});
	const uniqueIds = rawPosts.map(r => r._id);
	await this.store.dispatch(`${PostStore}/${PostActions.receiveBulk}`, rawPosts);
	const getter = this.store.getters[`${PostStore}/${PostGetters.getPostsByIds}`];
	const items = getter(Array.from(uniqueIds));
	this.store.commit(`${ExploreStore}/${ExploreMutations.setItems}`, {
		type,
		content: {
			items,
			ts: Date.now(),
		},
	});
}

function receiveReaction(message) {
	const { type } = message;
	this.store.commit(`${PostStore}/${PostMutations.receiveReaction}`, message[type]);
}

function squad (message) {
	this.store.commit(`${UserStore}/${UserMutations.setUserList}`, message.users);
}

export class WSMessages {
	singleItemPost = acceptPost;
	pollPost = acceptPost;
	outfitPost = acceptPost;
	galleryPost = acceptPost;

	likes = receiveReaction;

	followers = squad;
	following = squad;

	blog = activity;
	wishlist = activity;

	topGallery = exploreItems;
	topOutfits = exploreItems;
	endingPolls = exploreItems;
	topItems = exploreItems;

	constructor(store) {
		this.store = store;
	}

	dispatch (msg) {
		const { type } = msg;
		if (type !== 'dispatch' && this[type]) {
			this[type](msg);
		} else {
			// TODO: gracefull report
			// console.warn('Unknown message type', msg);
		}
	}

	squadders (message) {
		this.store.commit(`${FeedStore}/${FeedMutations.receiveSquadders}`, message.squadders);
	}

	comments (message) {
		this.store.commit(`${PostStore}/${PostMutations.receiveComments}`, message);
	}

	explore (message) {
		const users = message.entries.filter(e => e.type === 'user')
			.map((e) => {
				const { user } = e;
				return { ...user, followers: { me: e.following } };
			});
		squad.call(this, { users });
	}

	async feed (message) {
		await this.store.dispatch(`${PostStore}/${PostActions.receiveBulk}`, message.feed);
		const postsGetter = this.store.getters[`${PostStore}/${PostGetters.getPostByIdList}`];
		const uniqueIds = new Set([...(this.store.state.feed.items || []), ...message.feed].map(p => p.guid));
		const posts = postsGetter(Array.from(uniqueIds));
		this.store.commit(`${FeedStore}/${FeedMutations.setLoading}`, false);
		this.store.commit(`${FeedStore}/${FeedMutations.setItems}`, posts || []);
		this.store.commit(`${FeedStore}/${FeedMutations.markAllLoaded}`, message.feed);
	}

	async feedHome (message) {
		const { home } = this.store.state;
		let { watchers, public: publicPosts, interactions } = message;
		watchers = watchers.filter(p => !home.watchers.find(w => w.guid === p.guid));
		publicPosts = publicPosts.filter(p => !home.public.find(pp => pp.guid === p.guid));
		interactions = interactions.filter(i => !home.interactions.find(ip => ip.post.guid === i.post.guid));

		const interactionPosts = (interactions || []).map(p => p.post);
		const newPosts = [...watchers, ...publicPosts, ...interactionPosts];

		await this.store.dispatch(`${PostStore}/${PostActions.receiveBulk}`, newPosts);
		const postsGetter = this.store.getters[`${PostStore}/${PostGetters.getPostsByIds}`];
		const posts = postsGetter(Array.from(new Set(newPosts.map(p => p.guid))));

		this.store.commit(`${HomeStore}/${HomeMutations.receive}`, {
			posts,
			watchers,
			publicPosts,
			interactions,
			interactionPage: message.interactionPage,
		});
		this.store.commit(`${HomeStore}/${HomeMutations.markAllLoaded}`, posts);
		this.store.commit(`${HomeStore}/${HomeMutations.setLoading}`, false);
	}

	like (message) {
		const { guid, likes } = message;
		const post = this.store.getters[`${PostStore}/${PostGetters.getPostById}`](guid);
		post && this.store.commit(`${PostStore}/${PostMutations.setPostLike}`, { ...likes, post });
	}

	notifComment (message) {
		const { postId, text, user } = message;

		this.store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);

		const post = this.store.getters[`${PostStore}/${PostGetters.getPostById}`](postId);
		const comment = {
			text,
			author: user,
		};
		this.store.commit(`${PostStore}/${PostMutations.addComment}`, { comment, post });
	}

	notifTagged (message) {
		this.store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);
	}

	notifLike (message) {
		const { iLike, postId, user } = message;
		const mod = (iLike ? 1 : -1);

		const post = this.store.getters[`${PostStore}/${PostGetters.getPostById}`](postId);
		if (iLike) {
			this.store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);
			this.store.commit(`${PostStore}/${PostMutations.addLike}`, { post, user });
		}

		this.store.dispatch(`${PostStore}/${PostActions.modifyLike}`, { mod, post });
	}

	notifVote (message) {
		const post = this.store.getters[`${PostStore}/${PostGetters.getPostById}`](message.guid);
		post.item1.votes = message.item1.votes;
		post.item2.votes = message.item2.votes;
		post.voted = this.store.state.user.me.userId === message.voter.guid;
		this.store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);
	}

	notifEndPoll (message) {
		const { guid } = message;
		this.store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);
		acceptPost.call(this, { closed: true, guid });
	}

	notifAcceptSquad (message) {
		this.store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);
		const { other } = this.store.state.user;
		if (other && other.guid === message.userId) {
			this.store.state.socket._ws.sendObj({
				type: 'fetchUser',
				guid: other.guid,
			});
		}
		this.store.state.socket._ws.sendObj({ type: 'fetchUser' });
		prefetch({
			type: 'fetchSquadders',
			store: this.store,
		});
	}

	notifInviteSquad (message) {
		if (!message.denied) {
			this.store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);
		}
		const { other } = this.store.state.user;
		if (other && other.guid === message.userId) {
			this.store.state.socket._ws.sendObj({
				type: 'fetchUser',
				guid: other.guid,
			});
		}
		prefetch({
			type: 'fetchSquadders',
			store: this.store,
		});
	}

	squadUpdated () {
		const { other } = this.store.state.user;
		if (other) {
			this.store.state.socket._ws.sendObj({
				type: 'fetchUser',
				guid: other.guid,
			});
		}
		this.store.state.socket._ws.sendObj({ type: 'fetchUser' });
		prefetch({
			type: 'fetchSquadders',
			store: this.store,
		});
	}

	notifications (message) {
		this.store.commit(`${NotificationStore}/${NotificationMutations.receive}`, { notifications: message.notifications });
	}

	ping () {
		this.store.state.socket._ws.sendObj({ type: 'pong' });
	}

	resquadded (message) {
		this.store.dispatch(`${PostStore}/${PostActions.updateResquadd}`, message.items);
	}

	uploadURL (message) {
		this.store.commit(`${PostStore}/${PostMutations.uploadURL}`, message.url);
	}

	userProfile (message) {
		const { user } = message;
		if (user.userId === this.store.state.user.me.userId) {
			return this.store.commit(`${UserStore}/${UserMutations.setMe}`, user);
		}
		this.store.commit(`${UserStore}/${UserMutations.setOther}`, user);
	}

	pollResult (message) {
		const { pollResult } = message;
		this.store.commit(`${PostStore}/${PostMutations.setPollResult}`, pollResult);
	}

	pairedItems (message) {
		const { pairedItems } = message;
		this.store.dispatch(`${PairedItemStore}/${PairedItemActions.setPairedItem}`, pairedItems);
	}

	post(message) {
		const { post } = message;
		this.store.commit(`${PostStore}/${PostMutations.setCurrentPost}`, post);
	}

	friends(message) {
		const { users } = message;
		this.store.commit(`${ExploreStore}/${ExploreMutations.setFriends}`, users);
	}

	moderationFailed() {
		this.store.commit(`${PostStore}/${PostMutations.setUploadingPicture}`, 'violation');
	}

	shortURL(message) {
		this.store.commit(`${PostStore}/${PostMutations.shortURL}`, message);
	}
};
