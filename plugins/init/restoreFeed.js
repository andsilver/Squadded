import { FeedStore } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';

export default async ({ store }) => {
	const posts = [];
	const { length } = sessionStorage;
	for (let i = 0; i < length; i++) {
		const key = sessionStorage.key(i);
		if (!key.startsWith(FeedStore)) {
			continue;
		}
		const post = JSON.parse(sessionStorage.getItem(key));
		posts.push(post);
	}

	await store.dispatch(`${PostStore}/${PostActions.receiveBulk}`, posts);

	/**
	 * Commented below line for performance. It takes time on rendering posts.
	 *
	 */

	// const postsGetter = store.getters[`${PostStore}/${PostGetters.getPostByIdList}`];
	// const feed = postsGetter(posts.map(p => p.guid));
	// store.state.activity.community = feed;
};
