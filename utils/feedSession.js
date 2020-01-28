import { FeedStore } from '~/store/feed';

const { FEED_STORE_LIMIT } = process.env;

export const storeInSession = (post) => {
	if (!post || !post.guid) {
		return;
	}
	const keys = Object.keys(sessionStorage).filter(key => key.startsWith(FeedStore));
	if (keys.length >= FEED_STORE_LIMIT) {
		const key = keys.slice(-1)[0];
		const overflowItem = sessionStorage.getItem(key);
		const overflowId = overflowItem.correlationId || overflowItem.guid;
		removeFromSession(overflowId);
	}
	sessionStorage.setItem(`${FeedStore}-${post.guid}`, JSON.stringify(post.toStore()));
};

export const removeFromSession = (id) => {
	sessionStorage.removeItem(`${FeedStore}-${id}`);
};
