import { FeedPost } from '../classes/FeedPost';
import { storeInSession, removeFromSession } from '~/utils/feedSession';
import { storeCommentReportInSession, storePostReportInSession } from '~/utils/reportSession';

export const PostStore = 'post';

export const state = () => ({
	all: [],
	pollResult: null,
	uploadingPicture: null,
	coords_set: null,
});

export const PostGetters = {
	getPostById: 'getPostById',
	getPostByIdList: 'getPostByIdList',
	getItemsById: 'getItemsById',
	getPollResult: 'getPollResult',
	getPostsByIds: 'getPostsByIds',
};

export const getters = {
	[PostGetters.getPostById]: state => id => state.all.find(i => i.postId === id),
	[PostGetters.getPostByIdList]: state => ids => state.all.filter(i => ids.includes(i.postId)),
	[PostGetters.getItemsById]: state => id => state.all.map(post => post.getItem(id)).filter(post => post),
	[PostGetters.getPollResult]: state => state.pollResult,
	[PostGetters.getPostsByIds]: state => ids => (ids || []).map(id => state.all.find(p => p.postId === id)).filter(p => !!p),
};

export const PostMutations = {
	addComment: 'addComment',
	addLike: 'addLike',
	addPost: 'addPost',
	incrementVote: 'incrementVote',
	postLoaded: 'postLoaded',
	receiveReaction: 'receiveReaction',
	receiveComments: 'receiveComments',
	resetComments: 'resetComments',
	resetLikes: 'resetLikes',
	resquaddHasUpdated: 'resquaddHasUpdated',
	setPostLike: 'setPostLike',
	setPrivate: 'setPrivate',
	setText: 'setText',
	uploadURL: 'uploadURL',
	setPollResult: 'setPollResult',
	deleteComment: 'deleteComment',
	setCurrentPost: 'setCurrentPost',
	setUploadingPicture: 'setUploadingPicture',
	shortURL: 'shortURL',
	unsquadd: 'unsquadd',
	reset: 'reset',
};

function suffix () {
	return Math.random().toString(36).slice(2);
}

export const mutations = {
	coords_set(state, data) {
		state.coords_set = data;
	},
	[PostMutations.addComment]: (state, { comment, post }) => {
		if (!post) {
			return;
		}
		post.comments.messages.push(comment);
		post.comments.count = post.comments.messages.length;
	},
	[PostMutations.addLike]: (state, { post, user }) => {
		if (!post) {
			return;
		}
		!post.likes.users && (post.likes.users = []);
		if (post.likes.users.find(u => u.guid !== user.guid)) {
			post.likes.users.unshift(user);
			post.likes.count += 1;
		}
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
	[PostMutations.receiveComments]: (state, reactions) => {
	},
	[PostMutations.resquaddHasUpdated]: (state, reactions) => {
	},
	[PostMutations.uploadURL]: (state, url) => {
	},
	[PostMutations.resetComments]: (state, { comments, post, myUserId }) => {
		comments.forEach((c) => {
			c.byMe = c.author.guid === myUserId;
		});
		!post.comments && (post.comments = {});
		post.comments.messages = comments;
		post.comments.count = comments.length;
	},
	[PostMutations.deleteComment]: (state, { comment, post }) => {
		const index = post.comments.messages.findIndex(c => c._id === comment._id);
		if (index === -1) {
			return;
		}
		post.comments.messages.splice(index, 1);
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
	[PostMutations.setPollResult]: (state, pollResult) => {
		state.pollResult = pollResult ? new FeedPost(pollResult) : null;
	},
	[PostMutations.setCurrentPost]: () => {},
	[PostMutations.setUploadingPicture]: (state, pic) => {
		state.uploadingPicture = pic;
	},
	[PostMutations.shortURL]: () => {},
	[PostMutations.reset]: (state) => {
		state.all = [];
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
	deleteComment: 'deleteComment',
	reportComment: 'reportComment',
	reportPost: 'reportPost',
};

export const actions = {
	coords_set({ commit }, data) {
		commit('çoords_set', data);
	},
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
	[PostActions.reSquaddItem]: ({ rootState, dispatch, getters }, payload) => {
		const items = getters[PostGetters.getItemsById](payload.item.itemId);
		(items || []).forEach((item) => {
			item.squadded = true;
		});
		return dispatch(PostActions.saveItem, {
			...payload,
			type: 'singleItemPost',
			private: rootState.user.me.private,
		});
	},
	[PostActions.saveItem]: ({ rootState, commit }, rawPost) => {
		const hasPrivateKey = Object.prototype.hasOwnProperty.call(rawPost, 'private');
		const post = new FeedPost({
			...rawPost,
			byMe: true,
			correlationId: `${Date.now()}${suffix()}`,
			user: rootState.user.me.short(),
			private: hasPrivateKey ? rawPost.private : rootState.user.me.private,
		});

		commit(PostMutations.addPost, post);
		if (rootState.socket.isConnected && rootState.socket.isAuth) {
			// TODO? add some queue for sync after reconnect
			rootState.socket.$ws.sendObj(post.toMessage());
		}
		return post;
	},
	[PostActions.sendComment]: ({ rootState, commit }, { text, post, items }) => {
		function getUsersFromComment(comment) {
			const users = [];
			const regex = new RegExp('(@)\\[(.*?)\\]\\((.*?):(.*?)\\)', 'gi');
			let match;
			while ((match = regex.exec(comment)) != null) {
				users.push(match[4]);
			}
			return users;
		};

		rootState.socket.$ws.sendObj({
			guid: post.guid,
			text,
			type: 'addComment',
			notifusers: getUsersFromComment(text),
			...((items && items.length) && { items }),
		});

		const comment = {
			author: rootState.user.me.short(),
			ts: Date.now(),
			text,
			byMe: true,
			...((items && items.length) && { items }),
		};
		commit(PostMutations.addComment, { comment, post });
	},
	[PostActions.toggleLike]: ({ rootState }, post) => {
		if (!post.guid) {
			return;
		}
		const byMe = !post.likes.byMe;
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
		(rawItems || []).forEach((rawItem) => {
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
	[PostActions.deleteComment]: ({ commit, rootState }, { post, comment }) => {
		rootState.socket.$ws.sendObj({
			type: 'deleteComment',
			commentId: comment._id,
		});
		commit(PostMutations.deleteComment, { post, comment });
	},
	[PostActions.reportComment]: ({ commit, rootState }, { post, comment, reason, other }) => {
		rootState.socket.$ws.sendObj({
			type: 'report',
			commentId: comment._id,
			reason,
			other: reason === 'other' ? other : null,
		});
		commit(PostMutations.deleteComment, { post,	comment });
		storeCommentReportInSession(comment);
	},
	[PostActions.reportPost]: ({ rootState }, { post, reason, other }) => {
		rootState.socket.$ws.sendObj({
			type: 'report',
			postId: post.postId || post.guid,
			reason,
			other,
		});
		storePostReportInSession(post);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
