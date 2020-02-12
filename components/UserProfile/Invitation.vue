<template>
	<div class="my-4">
		<div ref="invite-text" class="invite-text text-center mb-4">
			{{ $t('user.invitation.text', { user: user.name }) }}
		</div>
		<div ref="invite-actions" class="d-flex justify-center">
			<Button ref="accept-btn" class="ma-0 mr-4" @click.native="accept">
				<v-icon x-small>
					sqdi-checkmark
				</v-icon>
				<span class="ml-2">{{ $t('user.invitation.accept') }}</span>
			</Button>
			<v-btn ref="deny-btn" outlined depressed class="deny-btn">
				{{ $t('user.invitation.deny') }}
			</v-btn>
		</div>
	</div>
</template>
<script>
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
	methods: {
		accept() {
			if (!this.me.nameSelected) {
				this.$router.push('/select-username');
				return;
			}
			this.$ws.sendObj({
				type: 'acceptSquad',
				targetUserId: this.user.userId,
			});
		},
	},
};
</script>
<style lang="stylus" scoped>
.invite-text
	background #f5f5f5
	padding 10px 12px
	color black
	font-size 12px
	font-weight 600
	border-radius 16px
.deny-btn
	font-size 0.6em
	font-weight 700
	letter-spacing 1px
	border-radius 10px
</style>
