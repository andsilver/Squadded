import { ActivityStore, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { PostStore, PostActions, PostGetters, PostMutations } from '~/store/post';
import { UserStore, UserMutations } from '~/store/user';

async function acceptPost(message) {
	if (!this.store.state.feed.items.length) {
		// tmp patch while infinite scroll not ready
		this.store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
	}
	const post = await this.store.dispatch(`${PostStore}/${PostActions.receiveItem}`, message);
	post && this.store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
}

async function activity (message) {
	const { type } = message;
	const rawPostsList = message[type];
	if (type === 'wishlist') {
		rawPostsList.forEach(w => (w.guid = w.item.itemId));
	}
	await this.store.dispatch(`${PostStore}/${PostActions.receiveBulk}`, rawPostsList);
	const getter = this.store.getters[`${PostStore}/${PostGetters.getPostByIdList}`];
	const posts = getter(rawPostsList.map(r => r.guid))
		.sort((a, b) => b.ts - a.ts);
	this.store.commit(`${ActivityStore}/${ActivityMutations.setListOfType}`, { posts, type });
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

	comments = receiveReaction;
	likes = receiveReaction;

	followers = squad;
	following = squad;

	blog = activity;
	squadders = activity;
	wishlist = activity;

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

	async feed (message) {
		const newPosts = await this.store.dispatch(`${PostStore}/${PostActions.receiveBulk}`, message.feed);
		this.store.commit(`${FeedStore}/${FeedMutations.addBulk}`, newPosts);
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

	notifications (message) {
		this.store.commit(`${NotificationStore}/${NotificationMutations.receive}`, message.notifications);
	}

	ping () {
		this.store.state.socket._ws.sendObj({ type: 'pong' });
	}

	resquadded (message) {
		this.store.dispatch(`${PostStore}/${PostActions.updateResquadd}`, message.items);
	}

	userProfile (message) {
		const { user } = message;
		if (user.userId === this.store.state.user.me.userId) {
			return this.store.commit(`${UserStore}/${UserMutations.setMe}`, user);
		}
		this.store.commit(`${UserStore}/${UserMutations.setOther}`, user);
	}
};
