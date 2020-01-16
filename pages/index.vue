<template>
	<v-container>
		<v-layout
			v-if="!socket.isPendingAuth"
			column
		>
			<div class="login">
				<div class="text-center my-2">
					<!--<span>{{ $t('getStarted') }}</span>-->
					<div class="brand-section">
						<div class="brand-title">
							{{ $t('ShopWithYourFriendsOn') }}
						</div>
						<img src="../assets/img/logo-dcm.svg" class="b-logo">
						<div class="poweredby">
							{{ $t('PoweredBy') }}
							<img src="../assets/img/squaddedcyrcleB_trim.svg" class="powerdby-image">
						</div>
					</div>
				</div>
				<div class="sign-in">
					{{ $t('Signin') }}
				</div>
				<div class="social">
					<social-btn for="fb" class="facebook-btn social-btn" />
					<social-btn for="inst" class="instagram-btn social-btn" />
				</div>
				<div class="or-section">
					<span>{{ $t('or') }}</span>
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
	margin-top 6.81vw
	span
		font-size 3.23vw
		font-weight 600
		text-transform capitalize
.brand-section
	background #F4F4F5
	padding 4.87vw 12.36vw 2.55vw 15.32vw
	border-radius 4vw
	.brand-title
		font-family: 'Montserrat', sans-serif
		font-weight: 600
		font-size: 4.61vw
		line-height: 3.66vw
		padding-bottom: 3.27vw
	img.b-logo
		width 23.38vw
		height 15.23vw
		margin-bottom 4.46vw
	.poweredby
		font-size 2.92vw
		font-weight 600
		display flex
		align-items center
		justify-content center
		img.powerdby-image
			width 22.76vw
			margin-left 1.23vw
.sign-in
	font-size 7.38vw
	font-weight 700
	text-align center
	margin-top 10VW
.or-section
	margin-top 11.67vw
	font-size 3.69vw
	color #B8B8BA
	position relative
	z-index 1
	text-align center
	&::before
		border-top 0.37vw solid rgba(184, 184, 186, .30)
		content ''
		margin 0 auto
		position absolute
		top 50%
		left 0
		right 0
		bottom 0
		z-index -1
	span
		background #fff
		padding 0 6.61vw
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
	asyncData ({ store, redirect }) {
		if (store.state.socket.isAuth) {
			redirect(DEFAULT_LANDING);
		}
	},
	computed: {
		...mapState([
			'socket',
		]),
	},
};
</script>
