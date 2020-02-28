<template>
	<Button v-if="!user.isMe" ref="follow-btn" class="follow-btn" :class="{ following }" @click.native="toggleFollow">
		{{ following ? $t('user.Following') : $t('user.Follow') }}
	</Button>
</template>

<script>
import Button from '~/components/common/Button';
import { FeedStore, FeedMutations } from '~/store/feed';
import { UserStore, UserMutations } from '~/store/user';
import { HomeStore, HomeMutations } from '~/store/home';
import { isBoolean } from '~/utils/isBoolean';

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
	computed: {
		following () {
			return (this.user.followers && this.user.followers.me);
		},
	},
	methods: {
		toggleFollow (follow) {
			const { user } = this;
			follow = isBoolean(follow) ? follow : !user.followers.me;
			if (user.isMe) {
				return;
			}
			if (!user.followers) {
				this.$router.push(`/user/${user.guid}`);
			}
			this.$ws.sendObj({
				type: 'follow',
				guid: user.userId,
				follow,
			});
			this.$store.commit(`${FeedStore}/${FeedMutations.clear}`);
			this.$store.commit(`${HomeStore}/${HomeMutations.clear}`);
			this.$store.commit(`${UserStore}/${UserMutations.setFollow}`, { follow, user });
			this.$forceUpdate();
		},
	},
};
</script>

<style lang="stylus" scoped>
	.v-btn
	&.follow-btn
		padding-left 32px
		background-image url('~assets/img/eye.svg')
		background-size 3.40vw
		background-position-y center
		background-position-x 4.7vw
		width 26.92vw
		font-size 2.153vw
		font-weight 700
		padding-left 8vw !important
		&.following
			background-color #F5F5F5 !important
			border-color #F5F5F5 !important
			color #000
			background-image url('~assets/img/checked.svg')
			width: 30VW
			background-size 2.81vw
			padding-left 6vw
			background-position-x 4.07vw
</style>
