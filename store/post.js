export const PostStore = 'post';

export const PostMutations = {
	addComment: 'addComment',
	incrementVote: 'incrementVote',
	receiveReaction: 'receiveReaction',
	resetComments: 'resetComments',
	resetLikes: 'resetLikes',
	setPostLike: 'setPostLike',
	setPrivate: 'setPrivate',
	setText: 'setText',
};

export const mutations = {
	[PostMutations.addComment]: (state, { comment, post }) => {
		if (!post) {
			return;
		}
		post.comments.messages.push(comment);
		post.comments.count = post.comments.messages.length;
	},
	[PostMutations.incrementVote]: (state, { post, vote }) => {
		post.voted = vote;
		post[`item${vote}`].votes += 1;
	},
	[PostMutations.receiveReaction]: (state, reactions) => {
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

		if (payload.hasOwnProperty('byMe')) {
			post.likes.byMe = payload.byMe;
		}
		if (payload.hasOwnProperty('count')) {
			post.likes.count = payload.count;
		}
	},
	[PostMutations.setText]: (state, { text, post }) => {
		post.text = text;
	},
	[PostMutations.setPrivate]: (state, props) => {
		const { post } = props;
		post.private = props.private;
	},
};

export const PostActions = {
	editText: 'editText',
	sendComment: 'sendComment',
	toggleLike: 'toggleLike',
	modifyLike: 'modifyLike',
	updatePrivate: 'updatePrivate',
	vote: 'vote',
};

export const actions = {
	[PostActions.editText]: ({ rootState, commit }, { text, post }) => {
		commit(PostMutations.setText, { text, post });
		rootState.socket.$ws.sendObj(post.toMessage());
	},
	[PostActions.updatePrivate]: ({ rootState, commit }, props) => {
		const { post } = props;
		commit(PostMutations.setPrivate, { post, private: props.private });
		rootState.socket.$ws.sendObj(post.toMessage());
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
	[PostActions.modifyLike]: ({ commit }, { mod, post }) => {
		if (!post) {
			return;
		}
		const count = post.likes.count + mod;
		commit(PostMutations.setPostLike, { count, post });
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
	mutations,
	actions,
};
