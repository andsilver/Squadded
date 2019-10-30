export const PostStore = 'post';

export const PostMutations = {
	addComment: 'addComment',
	receiveComments: 'receiveComments',
	resetComments: 'resetComments',
	setPostLike: 'setPostLike',
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
	[PostMutations.setText]: (state, { text, post }) => {
		post.text = text;
	},
};

export const PostActions = {
	editText: 'editText',
	sendComment: 'sendComment',
	toggleLike: 'toggleLike',
	modifyLike: 'modifyLike',
};

export const actions = {
	[PostActions.editText]: ({ rootState, commit }, { text, post }) => {
		commit(PostMutations.setText, { text, post });
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
};

export default {
	namespaced: true,
	mutations,
	actions,
};
