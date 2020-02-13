<template>
	<div class="d-flex align-center justify-center onging-actions">
		<Button class="flex-grow-1 mr-4" @click.native="signin">
			{{ $t('Signin') }}
		</Button>
		<v-btn ref="skip-btn" outlined depressed class="skip-btn flex-grow-1" @click="skip">
			{{ $t('landing_post.skip') }}
		</v-btn>
	</div>
</template>

<script>
import { DEFAULT_LANDING } from '~/store/squad';
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
	},
	asyncData({ store, redirect }) {
		if (!store.state.socket.isAuth) {
			return;
		}
		redirect(DEFAULT_LANDING);
	},
	methods: {
		skip () {
			this.$router.push('/community');
		},
		signin () {
			this.$router.push('/');
		},
	},
	head: () => ({
		title: 'Onboarding-Stories',
	}),
};
</script>

<style lang="stylus" scoped>
.skip-btn
	font-size 0.6em
	font-weight 700
	letter-spacing 1px
	border-radius 10px
.onging-actions
	padding 16px
	position fixed
	width 100%
	bottom 24px
</style>
