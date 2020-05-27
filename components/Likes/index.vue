<template>
	<UserList ref="likes-list" :users="likes" />
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
		likes: [],
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
			likes.forEach((l) => {
				l.isMe = l.guid === myUserId;
			});
			this.likes = likes;
			post.likes.users = likes;
			post.likes.count = likes.length;
		});
	},
	methods: {
	},
};
</script>

<style lang="stylus" scoped>
</style>
