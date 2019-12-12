<template>
	<UserList ref="likes-list" :users="users" />
</template>

<script>
import UserList from '~/components/UserList';
import { PostMutations, PostStore } from '~/store/post';
import { prefetch } from '~/helpers';

export default {
	components: {
		UserList,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
	}),
	computed: {
		users () {
			return this.post.likes.users;
		},
	},
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
