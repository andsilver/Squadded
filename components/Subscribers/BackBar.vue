<template>
	<h2 class="d-flex justify-space-between align-center">
		<GoBackBtn ref="go-back-btn" />
		<span ref="username">{{ username }}</span>
		<span class="pa-4" />
	</h2>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import GoBackBtn from '~/components/common/GoBackBtn';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';

const { mapState } = createNamespacedHelpers(UserStore);

export default {
	components: {
		GoBackBtn,
	},
	data: () => ({
		isMe: false,
	}),
	computed: {
		...mapState([
			'me',
			'other',
		]),
		username () {
			const user = this.isMe ? this.me : this.other;
			return user ? user.name : '';
		},
	},
	created () {
		this.isMe = this.$route.path.includes('/my');
		if (this.isMe) {
			return;
		}
		prefetch({
			guid: this.$route.params.id,
			mutation: `${UserStore}/${UserMutations.setOther}`,
			store: this.$store,
			type: 'fetchUser',
		});
	},
};
</script>

<style lang="stylus" scoped>
h2
	color #000
	font-size 4.307vw
	font-weight bold
	text-align center
	padding-bottom 0px
	position relative
	line-height 36px
</style>
