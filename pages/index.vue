<template>
	<v-container class="flex-grow-1 pd">
		<v-layout
			v-if="!socket.isPendingAuth"
			column
			class="justify-space-between"
		>
			<div class="notifications-container">
				<v-slide-y-transition v-if="resendNotify">
					<v-card
						class="d-flex w-100 justify-space-between align-center notification-message"
						:elevation="5"
						transition="scroll-y-transition"
					>
						<div class="d-flex align-center">
							<div class="notification-icon">
								<v-icon size="2.34vw" color="#FFFFFF">
									sqdi-checkmark
								</v-icon>
							</div>
							<div class="d-flex flex-column justify-center">
								<span class="notification-text">{{ $t('resendNotify') }}</span>
							</div>
						</div>
						<v-icon color="#B8B8BA" x-small @click="hideNotify">
							sqdi-close-cross
						</v-icon>
					</v-card>
				</v-slide-y-transition>
			</div>
			<div class="login">
				<Brand />
				<div ref="socialstep-one" class="social_step-one" :class="{ active: showstepOne, in_active: !showstepOne}">
					<div class="text-center pt-6 mt-12 mt-md-0 mb-6 font-weight-bold">
						{{ $t('signin.signin_to_shop_with_your_friends') }}
					</div>
					<div class="social-text-section" :class="{ hide_socila: showstepTwo}">
						<div class="social">
							<social-btn for="fb" :terms-status="terms" class="facebook-btn social-btn mb-3" @termsError="shwoTermsError" />
							<social-btn for="google" :terms-status="terms" class="google-btn social-btn elevation-1" @termsError="shwoTermsError" />
							<!-- <social-btn for="inst" :terms-status="terms" class="instagram-btn social-btn" @termsError="shwoTermsError" /> -->
						</div>
					</div>
					<div class="text-center">
						<div class="signemail" @click="email_link">
							{{ $t('signemail') }}
							<span v-if="terms_error" class="terms_error_msg">{{ $t('form.rules.terms.valid') }}</span>
						</div>
						<div class="term-section">
							<p>{{ $t('Wecare') }}</p>
						</div>
						<div class="custom-chk">
							<div class="form-group">
								<input id="html" v-model="terms" type="checkbox" @change="changeTerms()">
								<label class="term-text" :class="{error_terms: terms_error}" for="html"><p class="check_lable" /><p class="terms-text">{{ $t('agree_left') }} <span> <a href="javascript:void(0);">  {{ $t('agree_right') }} </a> </span></p></label>
							</div>
						</div>
					</div>
					<div class="signup-letter">
						<nuxt-link :to="{ path: '/community' }">
							<h5 class="text-center text-capitalize">
								{{ $t('skip') }}
							</h5>
						</nuxt-link>
					</div>
				</div>
				<div ref="step-one" class="sign-step-one" :class="{ active: showstepTwo, in_active: !showstepTwo}">
					<v-btn ref="go-back-btn" icon @click="emailback">
						<v-icon>
							sqdi-arrow-pointing-to-left
						</v-icon>
					</v-btn>
					<sign-form ref="signForm" :terms-status="terms" @sendOtp="showStepTwo" />
				</div>
				<div ref="step-two" class="sign-step-two" :class="{ active: showstepThree, in_active: !showstepThree}">
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
					<div>
						<div class="pin_sec">
							<Pin ref="pin" :invalid="showDigitError" @enter="validate" @change="pinChange" />
						</div>
						<span v-if="showError" ref="error-message" class="error-message">{{ $t('form.rules.pin.valid') }}</span>
						<span v-if="showOtpError" ref="error-message" class="error-message">{{ $t('form.rules.pin.required') }}</span>
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
					</div>
					<div class="resend-code">
						Still not receiving it?
						<span @click="requestOtp"> {{ $t('resend_code') }}</span>
					</div>
				</div>
			</div>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import SocialBtn from '~/components/Social-Button.vue';
import Brand from '~/components/common/Brand';
import SignForm from '~/components/Sign-Form.vue';
import { loginWithPIN, requestOtp } from '~/services/otp';
import Pin from '~/components/Pin';

export default {
	components: {
		'social-btn': SocialBtn,
		'sign-form': SignForm,
		Pin,
		Brand,
	},
	data: () => ({
		showstepTwo: false,
		showstepOne: true,
		showstepThree: false,
		email: null,
		pin: null,
		showError: false,
		showOtpError: false,
		terms_error: false,
		terms: false,
		showDigitError: false,
		resendNotify: false,
	}),
	computed: {
		...mapState([
			'socket',
			'merchant',
		]),
	},
	mounted () {
		this.$root.$emit('guestToolbarHide', {});
	},
	methods: {
		showStepTwo (email) {
			this.email = email;
			this.showstepTwo = false;
			this.showstepThree = true;
		},
		email_link() {
			this.showstepTwo = true;
			this.showstepOne = false;
		},
		goBack() {
			this.showstepTwo = true;
			this.showstepThree = false;
			this.showError = false;
			this.showDigitError = false;
			this.showOtpError = false;
			this.pin = null;
		},
		emailback() {
			this.showstepTwo = false;
			this.showstepOne = true;
			this.showError = false;
			this.showDigitError = false;
			this.showOtpError = false;
			this.pin = null;
		},
		changeTerms() {
			this.terms_error = false;
			this.$refs.signForm.changeTermsStatus();
		},
		pinChange(pin) {
			this.pin = pin;
		},
		shwoTermsError() {
			this.terms_error = true;
		},
		validate() {
			if (!this.pin || this.pin.length < 4) {
				this.showOtpError = true;
				this.showDigitError = true;
				return;
			} else {
				this.showOtpError = false;
				this.showDigitError = false;
			}
			const { userId, postId } = this.$route.query;
			const params = {
				merchantId: this.merchant.id,
				origin: 'normal',
				language: this.$root.$i18n.fallbackLocale,
			};
			if (userId) {
				params.originUserId = userId;
				params.origin = 'invitation';
			} else if (postId) {
				params.originPostId = postId;
				params.origin = 'share';
			}
			loginWithPIN(+this.pin, this.email, params).then(({ error, token }) => {
				if (error) {
					this.showError = true;
					this.showDigitError = true;
					return;
				}
				this.showError = false;
				this.showDigitError = false;
				window.postMessage(JSON.stringify({
					type: 'loggedIn',
					userToken: token,
				}), window.origin);
			});
		},
		hideNotify() {
			this.resendNotify = false;
		},
		requestOtp() {
			this.resendNotify = true;
			requestOtp(this.email);
		},
	},
	head: () => ({
		title: 'Onboarding-Login',
	}),
};
</script>

<style lang="stylus">
.pd
    padding 0 !important
.social
	display block
	margin 0 auto
	span
		font-size 4.30vw
		font-weight 600
		text-transform capitalize
.brand-section
	border-radius 4vw
	.brand-title
		font-family: 'Montserrat', sans-serif
		font-weight: 600
		font-size: 4.61vw
		line-height: 3.66vw
		padding-bottom: 3.27vw
	img.b-logo
		width 100%
		height 45.84vw
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
		p.description
			margin-bottom: 5.58vw
			font-size 3.69vw
			font-weight 500
			text-align center
			line-height 4.92vw
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
			margin-bottom 13.03vw
			margin-top 3.15vw
		.resend-code
			text-align center
			font-size 3.38vw
			line-height 4.61vw
			font-weight 500
			color #B8B8BA
			span
				color #000000
				cursor pointer
	.custom-chk
			padding-left 8vw
			padding-right 6.55vw
		.form-group
			display block
			margin-bottom 15px
		.form-group input
			padding 0
			height initial
			width initial
			margin-bottom 0
			display none
			cursor pointer
		.form-group label
			position relative
			cursor pointer
		.form-group label .check_lable
			position relative
			margin 0
			border 2px solid #dbdbdb
			display inline-block
			vertical-align top
			cursor pointer
			width 26px
			height 26px
			border-radius 3.076vw
		.form-group label .terms-text
			display inline-block
			width calc(100% - 26px)
			margin 0
			text-align left
			padding-left 2.36vw
			line-height 1.6
		.form-group input:checked + label .check_lable:after
			content ''
			display block
			position absolute
			top 11px
			left 11px
			transform translate(-50%, -50%)
			width 18px
			height 18px
			border-radius 2.076vw
			background #FD6256
	.term-section p
		color #000000
		font-size 3.69vw
		font-weight 500
		line-height 4.92vw
	label.term-text
		color #B8B8BA
		font-size 3.38vw
		font-weight 500
		line-height 4.92vw
		&.error_terms
			&:before
				border 2px solid #ef6256
	.signin-main-section
		position absolute
		top 20.61vw
		left 50%
		background #fff
		box-shadow 0 6px 40px rgba(0,0,0,0.1)
		width 62.9vw
		transform translate(-50%, 0%)
	.sign-in
		font-size 7.38vw
		font-weight 700
		text-align center
		text-transform uppercase
		letter-spacing 2px
		padding-top 16.46vw
		padding-bottom 3.07vw
	.poweredby
		font-size 2.92vw
		font-weight 600
		display flex
		align-items center
		justify-content center
		padding-bottom 8.14vw
		img.powerdby-image
			width 22.76vw
			margin-left 2.15vw
	.signemail
		color #FD6256
		font-weight 600
		font-size 3.69vw
		padding-top 8.26vw
		padding-bottom 12.76vw
		line-height 5.84vw
		position relative
		.terms_error_msg
			background #fd6256
			border-radius 1.53vw
			height 6.76vw
			font-size 3.38vw
			color #fff
			display -webkit-box
			display flex
			-webkit-box-align center
			align-items center
			-webkit-box-pack center
			justify-content center
			font-weight 500
			line-height 4.61vw
			position absolute
			width 90%
			left 50%
			transform translateX(-50%)
			bottom 2.30vw
	.sign-step-two
		display none
		transition all 0.2s ease-in-out
		margin-top: 25.35vw;
		padding 0 7.69vw
	.sign-step-two.active
		display block
		-webkit-animation slide-down 0.5s ease-out
		-moz-animation slide-down 0.5s ease-out
		margin-bottom 64px
	.sign-step-one
		position relative
		button.v-btn--flat
			position absolute
			left 7.69vw
			top -5px
			color #000
	.sign-step-one.in_active
		display none
		transition all 0.2s ease-in-out
	.sign-step-one.active
		display block
		transition all 0.2s ease-in-out
		margin-bottom 64px
		margin-top: 25.35vw;
		padding 0 7.69vw
	.social_step-one.in_active
		display none
		transition all 0.2s ease-in-out
	.social_step-one.active
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
		transition max-height 0.2s ease-out
		height auto
		&.hide_socila
			max-height 0
	.otp-field .v-input__control
		height 10.76vw !important
		min-height auto !important
.signup-letter
	margin-top 8.26vw
	h5
		font-size 3.69vw
		line-height 5.84vw
		font-weight 700
		padding-right 0
.error-message
	background #FD6256
	border-radius 1.53vw
	height 6.76vw
	text-align center
	font-size 3.38vw
	color #fff
	display flex
	align-items center
	justify-content center
	font-weight 500
	line-height 4.61vw
	margin-top 3.07vw
.notifications-container
	position fixed
	z-index 99
	width 100%
	.notification-message
		margin 0 3.07vw
		padding 3.30vw 3.07vw
		border-radius 0 0 15px 15px !important
		border-bottom-left-radius 20px
		border-bottom-right-radius 20px
		&::after
			content ''
			position absolute
			width calc(100% - 6vw)
			height 0.76vw
			background-color #ee5f53
			bottom -0.32vw
			border-radius 0 0 3.07vw 3.07vw
.notification-icon
	padding 0 1.9vw
	height 6.15vw
	margin-right 2.13vw
	background-color #FD6256
	border-radius 50%
	text-align center
.notification-text
	font-size 3.230vw
	color #000
	width 58vw
</style>
