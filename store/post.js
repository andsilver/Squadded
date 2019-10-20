export const PostStore = 'post';

export const PostMutations = {
	addComment: 'addComment',
	receiveComments: 'receiveComments',
	resetComments: 'resetComments',
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
};

export const PostActions = {
	sendComment: 'sendComment',
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
};

export default {
	namespaced: true,
	mutations,
	actions,
};
