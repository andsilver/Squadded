<template>
	<v-container>
		<v-layout
			v-if="!socket.isPendingAuth"
			column
			justify-center
			align-center
		>
			<div class="full-width">
				<div class="text-center my-2">
					<span>{{ $t('getStarted') }}</span>
				</div>
				<div class="my-3 social">
					<social-btn for="fb" />
					<span>{{ $t('or') }}</span>
					<social-btn for="inst" />
				</div>
				<sign-form />
			</div>
		</v-layout>
	</v-container>
</template>

<style lang="stylus">
.social
	display flex
	justify-content space-between

	span
		line-height 50px
</style>

<script>
import { mapState } from 'vuex';
import SocialBtn from '~/components/Social-Button.vue';
import SignForm from '~/components/Sign-Form.vue';
import { DEFAULT_LANDING } from '~/store/squad';

export default {
	components: {
		'social-btn': SocialBtn,
		'sign-form': SignForm,
	},
	computed: {
		...mapState([
			'socket',
		]),
	},
	asyncData ({ store, redirect }) {
		if (store.state.socket.isAuth) {
			redirect(DEFAULT_LANDING);
		}
	},
};
</script>
