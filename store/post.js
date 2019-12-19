import { FeedPost } from '../classes/FeedPost';
import { storeInSession, removeFromSession } from '~/utils/feedSession';

export const PostStore = 'post';

export const state = () => ({
	all: [],
});

export const PostGetters = {
	getPostById: 'getPostById',
	getPostByIdList: 'getPostByIdList',
	getItemsById: 'getItemsById',
};

export const getters = {
	[PostGetters.getPostById]: state => id => state.all.find(i => i.postId === id),
	[PostGetters.getPostByIdList]: state => ids => state.all.filter(i => ids.includes(i.postId)),
	[PostGetters.getItemsById]: state => id => state.all.map(post => post.getItem(id)).filter(post => post),
};

export const PostMutations = {
	addComment: 'addComment',
	addLike: 'addLike',
	addPost: 'addPost',
	incrementVote: 'incrementVote',
	postLoaded: 'postLoaded',
	receiveReaction: 'receiveReaction',
	resetComments: 'resetComments',
	resetLikes: 'resetLikes',
	resquaddHasUpdated: 'resquaddHasUpdated',
	setPostLike: 'setPostLike',
	setPrivate: 'setPrivate',
	setText: 'setText',
	uploadURL: 'uploadURL',
};

function suffix () {
	return Math.random().toString(36).slice(2);
}

export const mutations = {
	[PostMutations.addComment]: (state, { comment, post }) => {
		if (!post) {
			return;
		}
		post.comments.messages.push(comment);
		post.comments.count = post.comments.messages.length;
	},
	[PostMutations.addLike]: (state, { post, user }) => {
		post.likes.users.unshift(user);
		post.likes.count = post.likes.users.length;
	},
	[PostMutations.addPost]: (state, post) => {
		state.all.unshift(post);
	},
	[PostMutations.incrementVote]: (state, { post, vote }) => {
		post.voted = vote;
		post[`item${vote}`].votes += 1;
	},
	[PostMutations.postLoaded]: (state, rawPostData) => {
		const post = state.all.find(i => i.guid === rawPostData.guid || (i.correlationId && i.correlationId === rawPostData.correlationId));
		if (!post) {
			// was removed before load finish
			return;
		}
		if (rawPostData.error) {
			post.error = rawPostData.error;
			return;
		}
		post.update(rawPostData);
		removeFromSession(post.correlationId);
		post.unsetCorrelationId();
		storeInSession(post);
	},
	[PostMutations.receiveReaction]: (state, reactions) => {
	},
	[PostMutations.resquaddHasUpdated]: (state, reactions) => {
	},
	[PostMutations.uploadURL]: (state, url) => {
	},
	[PostMutations.resetComments]: (state, { comments, post }) => {
		post.comments.messages = comments;
		post.comments.count = comments.length;
	},
	[PostMutations.resetLikes]: (state, { likes, myUserId, post }) => {
		likes.forEach((l) => {
			l.isMe = l.guid === myUserId;
		});
		post.likes.users = likes;
		post.likes.count = likes.length;
	},
	[PostMutations.setPostLike]: (state, payload) => {
		const { post } = payload;
		if (!post) {
			return;
		}

		if (Object.prototype.hasOwnProperty.call(payload, 'byMe')) {
			post.likes.byMe = payload.byMe;
		}
		if (Object.prototype.hasOwnProperty.call(payload, 'count')) {
			post.likes.count = payload.count;
		}
	},
	[PostMutations.setPrivate]: (state, props) => {
		const { post } = props;
		post.private = props.private;
	},
	[PostMutations.setText]: (state, { text, post }) => {
		post.text = text;
	},
	[PostMutations.unsquadd]: (state, itemId) => {
		if (!itemId) {
			return;
		}
		state.all.forEach((post) => {
			const item = post.getItem(itemId);
			item && (item.squadded = false);
		});
	},
};

export const PostActions = {
	editText: 'editText',
	modifyLike: 'modifyLike',
	receiveBulk: 'receiveBulk',
	receiveItem: 'receiveItem',
	reSquaddItem: 'reSquaddItem',
	saveItem: 'saveItem',
	sendComment: 'sendComment',
	toggleLike: 'toggleLike',
	updatePrivate: 'updatePrivate',
	updateResquadd: 'updateResquadd',
	vote: 'vote',
};

export const actions = {
	[PostActions.editText]: ({ rootState, commit }, { text, post }) => {
		commit(PostMutations.setText, { text, post });
		rootState.socket.$ws.sendObj(post.toMessage());
	},
	[PostActions.modifyLike]: ({ commit }, { mod, post }) => {
		if (!post) {
			return;
		}
		const count = post.likes.count + mod;
		commit(PostMutations.setPostLike, { count, post });
	},
	[PostActions.receiveBulk]: ({ commit, getters }, feed) => {
		const newPosts = [];
		feed.forEach((rawPost) => {
			const post = getters[PostGetters.getPostById](rawPost.guid);
			if (!rawPost.correlationId && !post) {
				const newPost = new FeedPost(rawPost);
				newPosts.push(newPost);
				commit(PostMutations.addPost, newPost);
				return;
			}
			// just in case it is exit in a feed
			commit(PostMutations.postLoaded, rawPost);
		});
		return newPosts;
	},
	[PostActions.receiveItem]: ({ commit, getters }, rawPostData) => {
		const post = getters[PostGetters.getPostById](rawPostData.guid);

		if (!rawPostData.correlationId && !post) {
			// received from another user
			const post = new FeedPost(rawPostData);
			commit(PostMutations.addPost, post);
			return post;
		}

		commit(PostMutations.postLoaded, rawPostData);
	},
	[PostActions.reSquaddItem]: ({ dispatch }, payload) => {
		return dispatch(PostActions.saveItem, {
			...payload,
			type: 'singleItemPost',
		});
	},
	[PostActions.saveItem]: ({ rootState, commit }, rawPost) => {
		const post = new FeedPost({
			...rawPost,
			byMe: true,
			correlationId: `${Date.now()}${suffix()}`,
			user: rootState.user.me.short(),
		});

		commit(PostMutations.addPost, post);
		if (rootState.socket.isConnected && rootState.socket.isAuth) {
			// TODO? add some queue for sync after reconnect
			rootState.socket.$ws.sendObj(post.toMessage());
		}
		return post;
	},
	[PostActions.sendComment]: ({ rootState, commit }, { text, post }) => {
		rootState.socket.$ws.sendObj({
			guid: post.guid,
			text,
			type: 'addComment',
		});

		const comment = {
			author: rootState.user.me.short(),
			ts: Date.now(),
			text,
		};
		commit(PostMutations.addComment, { comment, post });
	},
	[PostActions.toggleLike]: ({ commit, rootState }, post) => {
		if (!post.guid) {
			return;
		}

		const byMe = !post.likes.byMe;
		commit(PostMutations.setPostLike, {
			post,
			count: post.likes.count + (byMe ? 1 : -1),
			byMe,
		});
		rootState.socket.$ws.sendObj({
			type: 'like',
			guid: post.guid,
			iLike: byMe,
		});
	},
	[PostActions.updatePrivate]: ({ rootState, commit }, props) => {
		const { post } = props;
		commit(PostMutations.setPrivate, { post, private: props.private });
		rootState.socket.$ws.sendObj(post.toMessage());
	},
	[PostActions.updateResquadd]: ({ commit, getters }, rawItems) => {
		if (!rawItems) {
			return;
		}
		rawItems.forEach((rawItem) => {
			const items = getters[PostGetters.getItemsById](rawItem.itemId);
			items.forEach((item) => {
				item.squadded = rawItem.squadded;
			});
		});
		commit('resquaddHasUpdated');
	},
	[PostActions.vote]: ({ commit, rootState }, { post, vote }) => {
		if (!post) {
			return;
		}
		commit(PostMutations.incrementVote, { post, vote });
		rootState.socket.$ws.sendObj({
			type: 'vote',
			pollId: post.postId,
			vote,
		});
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
