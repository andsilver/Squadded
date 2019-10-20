export const PostStore = 'post';

export const PostMutations = {
	addComment: 'addComment',
	receiveComments: 'receiveComments',
	resetComments: 'resetComments',
	setPostLike: 'setPostLike',
};

export const mutations = {
	[PostMutations.addComment]: (state, { comment, post }) => {
		post.comments.messages.push(comment);
		post.comments.count = post.comments.messages.length;
	},
	[PostMutations.receiveComments]: (state, comments) => {
	},
	[PostMutations.resetComments]: (state, { comments, post }) => {
		post.comments.messages = comments;
		post.comments.count = comments.length;
	},
	[PostMutations.setPostLike]: (state, payload) => {
		const { post } = payload;
		if (payload.hasOwnProperty('byMe')) {
			post.likes.byMe = payload.byMe;
		}
		if (payload.hasOwnProperty('count')) {
			post.likes.count = payload.count;
		}
	},
};

export const PostActions = {
	sendComment: 'sendComment',
	toggleLike: 'toggleLike',
};

export const actions = {
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
};

export default {
	namespaced: true,
	mutations,
	actions,
};
