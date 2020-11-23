import { createNamespacedHelpers, mapState } from 'vuex';
import { ActivityStore } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import { HomeStore, HomeMutations } from '~/store/home';
import { PostStore, PostActions } from '~/store/post';

const activityState = createNamespacedHelpers(ActivityStore).mapState;

export default {
	computed: {
		...activityState([
			'selected',
		]),
		...mapState([
			'socket',
			'user',
		]),
	},
	methods: {
		async createPost(msg, route = '/feed') {
			const post = await this.$store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
			this.$store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);

			if (!msg.private) {
				this.$store.commit(`${HomeStore}/${HomeMutations.addItem}`, post);
			}
			route && this.$router.push(route);
			return post;
		},
	},
};
