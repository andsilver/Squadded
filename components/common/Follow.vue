<template>
	<Button v-if="!user.isMe" ref="follow-btn" @click.native="toggleFollow">
		{{ user.followers.me ? $t('user.Unfollow') : $t('user.Follow') }}
	</Button>
</template>

<script>
import Button from '~/components/common/Button';
import { FeedStore, FeedMutations } from '~/store/feed';
import { UserStore, UserMutations } from '~/store/user';

export default {
	components: {
		Button,
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
	methods: {
		toggleFollow () {
			const { user } = this;
			if (user.isMe) {
				return;
			}
			const follow = !user.followers.me;
			this.$ws.sendObj({
				type: 'follow',
				guid: user.userId,
				follow,
			});
			this.$store.commit(`${FeedStore}/${FeedMutations.clear}`);
			this.$store.commit(`${UserStore}/${UserMutations.setFollow}`, { follow, user });
			this.$forceUpdate();
		},
	},
};
</script>

<style lang="stylus" scoped>

</style>
