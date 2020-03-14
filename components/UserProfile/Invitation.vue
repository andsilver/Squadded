<template>
	<div ref="invite-actions" class="d-flex justify-center">
		<Button ref="accept-btn" class="ma-0 mr-4" @click.native="accept">
			<v-icon x-small>
				sqdi-checkmark
			</v-icon>
			<span class="ml-2">{{ $t('user.invitation.accept') }}</span>
		</Button>
		<v-btn ref="deny-btn" outlined depressed class="deny-btn" @click="deny">
			{{ $t('user.invitation.deny') }}
		</v-btn>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
		me: {
			type: Object,
			required: true,
		},
	},
	computed: {
		...mapState([
			'socket',
		]),
	},
	methods: {
		accept() {
			if (!this.socket.isAuth) {
				return this.$router.push({ path: '/', query: { userId: this.user.guid || this.user.userId } });
			}
			if (!this.me.nameSelected) {
				return this.$router.push('/select-username');
			}
			this.$ws.sendObj({
				type: 'acceptSquad',
				targetUserId: this.user.userId,
			});
		},
		deny() {
			if (!this.socket.isAuth) {
				return this.$router.push('/');
			}
			if (this.user.squad && this.user.squad.exists) {
				this.$ws.sendObj({
					type: 'removeSquadder',
					guid: this.user.userId,
				});
			} else {
				this.$emit('deny');
			}
		},
	},
};
</script>
<style lang="stylus" scoped>
.deny-btn
	font-size 0.6em
	font-weight 700
	letter-spacing 1px
	border-radius 10px
</style>
