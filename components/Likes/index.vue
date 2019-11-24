<template>
	<v-list v-if="post.likes.users.length" ref="likes-list">
		<v-list-item v-for="user in post.likes.users" :key="user.guid">
			<UserLink
				ref="comment-author-user-link"
				size="30"
				:user="user"
			/>
		</v-list-item>
	</v-list>
</template>

<script>
import UserLink from '~/components/UserLink';
import { PostMutations, PostStore } from '~/store/post';
import { prefetch } from '~/helpers';

export default {
	components: {
		UserLink,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
	}),
	created () {
		return prefetch({
			guid: this.post.guid,
			mutation: `${PostStore}/${PostMutations.receiveReaction}`,
			store: this.$store,
			type: 'fetchLikes',
		}).then((likes) => {
			const { post } = this;
			const myUserId = this.$store.state.user.me.userId;
			this.$store.commit(`${PostStore}/${PostMutations.resetLikes}`, { likes, myUserId, post });
		});
	},
	methods: {
	},
};
</script>

<style lang="stylus" scoped>
</style>
