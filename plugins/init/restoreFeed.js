import { FeedStore, FeedMutations } from '~/store/feed';

export default ({ store }) => {
	store.commit(`${FeedStore}/${FeedMutations.restoreSession}`);
};
