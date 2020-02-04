<template>
	<v-container class="flex-grow-1">
		<v-layout
			v-if="!socket.isPendingAuth"
			column
			class="justify-space-between"
		>
			<div class="login">
				<div class="text-center my-2">
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
				<div class="social-text-section" :class="{ hide_socila: showstepTwo}">
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
				</div>
				<div ref="step-one" class="sign-step-one" :class="{ active: !showstepTwo, in_active: showstepTwo}">
					<sign-form ref="sign-form" @sendOtp="showStepTwo" />
				</div>
				<div ref="step-two" class="sign-step-two" :class="{ active: showstepTwo , in_active: !showstepTwo}">
					<h2>
						<v-btn ref="go-back-btn" icon @click="goBack">
							<v-icon>
								sqdi-arrow-pointing-to-left
							</v-icon>
						</v-btn>
						{{ $t('enterCode') }}
					</h2>
					<p class="description">
						{{ $t('spamNote') }}
					</p>
					<v-form ref="form">
						<v-text-field
							ref="pin-field"
							v-model="pin"
							:label="$t('form.pin')"
							type="number"
							solo
							flat
							dense
							class="otp-field"
						/>
						<v-btn
							ref="signup-validate-btn"
							class="full-width validate-btn"
							color="primary"
							large
							depressed
							@click="validate"
						>
							{{ $t('validate') }}
						</v-btn>
					</v-form>
					<div class="resend-code">
						Still not receiving it?<span> Resend code</span>
					</div>
				</div>
			</div>
			<div style="margin-bottom: 64px">
				<nuxt-link :to="{ path: '/community' }">
					<h5 class="text-right">
						{{ $t('sign_up_later') }}
					</h5>
				</nuxt-link>
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
.login
	.sign-step-two
		h2
			color #000
			font-size 4.307vw
			font-weight bold
			text-align center
			padding-bottom 0px
			position relative
			line-height 36px
			width 100%
			margin-bottom 7.69vw
		h2 button
			position absolute
			left 0
		.theme--light.v-btn.v-btn--icon
			color #000000
		&.active
			margin-top 12.41vw
		p.description
			margin-bottom: 5.58vw
			font-size 3.69vw
			font-weight 500
			text-align center
			line-height 4.92vw
		.v-input.otp-field
			height 10.79vw
			border 0.3vw solid #dbdbdb
			border-radius 3.07vw
			font-size 3.69vw
			color #000000
			line-height 4.92vw
			font-weight 400
			margin-bottom 6.15vw
		.otp-field input,
		.otp-field label
			font-size 3.69vw
			color #000000 !important
			line-height 4.92vw
			font-weight 400
			text-align center
			width 100%
			margin-top 2px
		button.full-width.validate-btn
			display block
			width 43.84vw
			margin 0 auto
			background-color #000 !important
			border-radius 3.07vw
			height 12.3vw !important
			font-size 2.61vw
			font-weight 700
			line-height 4.3vw
			letter-spacing 2px
			text-transform uppercase
			margin-bottom 13.03vw
		.resend-code
			text-align center
			font-size 3.38vw
			line-height 4.61vw
			font-weight 500
			color #B8B8BA
			span
				color #000000
	.sign-step-two.in_active
		display none
		transition all 0.2s ease-in-out
	.sign-step-two.active
		display block
		-webkit-animation slide-down 0.5s ease-out
		-moz-animation slide-down 0.5s ease-out
		margin-bottom 64px
	.sign-step-one.in_active
		display none
		transition all 0.2s ease-in-out
	.sign-step-one.active
		display block
		transition all 0.2s ease-in-out
		margin-bottom 64px
	@-webkit-keyframes slide-down
		0% { opacity: 0; }
		100% { opacity: 1; }
	@-moz-keyframes slide-down
		0% { opacity: 0; }
		100% { opacity: 1; }
	.social-text-section
		overflow hidden;
		transition max-height 0.2s ease-out
		max-height 500px
		height auto
		&.hide_socila
			max-height 0
	.otp-field .v-input__control
		height 10.76vw !important
		min-height auto !important
</style>

<script>
import { mapState } from 'vuex';
import SocialBtn from '~/components/Social-Button.vue';
import SignForm from '~/components/Sign-Form.vue';
import { DEFAULT_LANDING } from '~/store/squad';
import { loginWithPIN } from '~/services/otp';

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
	data: () => ({
		showstepTwo: false,
		email: null,
		pin: null,
	}),
	computed: {
		...mapState([
			'socket',
		]),
	},
	methods: {
		showStepTwo (email) {
			this.email = email;
			this.showstepTwo = true;
		},
		goBack() {
			this.showstepTwo = false;
		},
		validate() {
			loginWithPIN(+this.pin, this.email).then(({ userId, token }) => {
				localStorage.setItem('userToken', token);
			});
		},
	},
};
</script>
