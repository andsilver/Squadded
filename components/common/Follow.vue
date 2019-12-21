<template>
	<Button v-if="!user.isMe" ref="follow-btn" class="follow-btn" :class="{ following }" @click.native="toggleFollow">
		{{ following ? $t('user.Following') : $t('user.Follow') }}
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
	computed: {
		following () {
			return (this.user.followers && this.user.followers.me);
		},
	},
	methods: {
		toggleFollow () {
			const { user } = this;
			if (user.isMe) {
				return;
			}
			if (!user.followers) {
				this.$router.push(`/user/${user.guid}`);
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
.v-list-item
	.v-btn
	&.follow-btn
		padding-left 32px
		background-image url('~assets/img/plus.svg')
		background-size 2.769vw
		background-position-y center
		background-position-x 3.07vw
		width 23.076vw
		font-size 2.153vw
		&.following
			background-color #F4F4F5 !important
			border-color #F4F4F5 !important
			color #000
			background-image url('~assets/img/checked.svg')
			width 27.69vw
</style>
