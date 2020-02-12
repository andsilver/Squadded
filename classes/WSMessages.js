import { ActivityStore, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { PostStore, PostActions, PostGetters, PostMutations } from '~/store/post';
import { UserStore, UserMutations } from '~/store/user';
import { PairedItemStore, PairedItemActions } from '~/store/paired-item';
import { ExploreStore, ExploreMutations } from '~/store/explore';
import { STORAGE_VISITED_KEY } from '~/consts/keys';

async function acceptPost(message) {
	if (!this.store.state.feed.items.length) {
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
	const { type } = message;
	const rawPostsList = type === 'community' ? [...message.followers, ...message.community] : message[type];
	if (type === 'wishlist') {
		rawPostsList.forEach(w => (w.guid = w.item.itemId));
	}
	await this.store.dispatch(`${PostStore}/${PostActions.receiveBulk}`, rawPostsList);
	const existingItems = this.store.state.activity[type] || [];
	const uniqueIds = new Set([...existingItems, ...rawPostsList].map(p => p.guid));
	const getter = this.store.getters[`${PostStore}/${PostGetters.getPostByIdList}`];
	const posts = getter(Array.from(uniqueIds)).sort((a, b) => b.ts - a.ts);

	if (!localStorage.getItem(STORAGE_VISITED_KEY) && type === 'community') {
		posts[0].user.showPopover = true;
		localStorage.setItem(STORAGE_VISITED_KEY, Date.now().toString());
	}

	this.store.commit(`${ActivityStore}/${ActivityMutations.setListOfType}`, { posts, type });
	this.store.commit(`${ActivityStore}/${ActivityMutations.markAllLoaded}`, { loadedPosts: rawPostsList, type });
}

function exploreItems (message) {
	const { type } = message;
	const innerType = type.replace('top', '');
	const lowercased = innerType.charAt(0).toLowerCase() + innerType.slice(1);
	this.store.commit(`${ExploreStore}/${ExploreMutations.setItems}`, {
		type,
		content: {
			items: message[lowercased],
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
	community = activity;
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
		const uniqueIds = new Set([...this.store.state.feed.items, ...message.feed].map(p => p.guid));
		const posts = postsGetter(Array.from(uniqueIds));
		this.store.commit(`${FeedStore}/${FeedMutations.setLoading}`, false);
		this.store.commit(`${FeedStore}/${FeedMutations.setItems}`, posts);
		this.store.commit(`${FeedStore}/${FeedMutations.markAllLoaded}`, message.feed);
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

	notifEndPoll (message) {
		const { guid } = message;
		this.store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);
		acceptPost.call(this, { closed: true, guid });
	}

	notifAcceptSquad (message) {
		this.store.commit(`${NotificationStore}/${NotificationMutations.add}`, message);
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
};
