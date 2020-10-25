<template>
	<v-container class="flex-grow-1 pa-0">
		<v-layout
			v-if="!socket.isPendingAuth"
			column
			class="justify-space-between"
		>
			<div class="notifications-container">
				<v-slide-y-transition v-if="resendNotify">
					<v-card
						class="d-flex w-100 justify-space-between align-center notification-message-resend"
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
			<div ref="login" class="login">
				<Brand :merchant-title="merchant.siteTitle" />
				<div
					class="login-content pa-3"
					:class="{'invite-login': !!inviter}"
				>
					<Inviter v-if="inviter" :user="inviter" />
					<div ref="socialstep-one" class="social_step-one" :class="{ active: showstepOne, in_active: !showstepOne}">
						<div class="signin-text">
							{{ inviter ? $t('signin.signin_to_shop_with_your_friend', { name: inviter.screenName || inviter.name }) : $t('signin.signin_to_shop_with_your_friends') }}
						</div>
						<div class="custom-chk">
							<div class="form-group">
								<input id="terms-agree" v-model="terms" type="checkbox" @change="changeTerms()">
								<label class="term-text d-flex" :class="{error_terms: terms_error}" for="terms-agree">
									<div>
										<p class="check_lable" />
									</div>
									<p class="terms-text">
										{{ $t('agree_left') }}
										<span>
											<a ref="show-terms" @click="showTerms">
												{{ $t('agree_right') }}
											</a>
										</span>
									</p>
								</label>
							</div>
						</div>
						<div ref="social-login" class="social-text-section">
							<div class="social">
								<social-btn
									v-if="merchant.squadSLogin"
									ref="google-login"
									for="facebook"
									:terms-status="terms"
									class="facebook-btn social-btn mb-3"
									@termsError="shwoTermsError"
								/>
								<social-btn
									v-if="merchant.squadSLogin"
									for="google"
									:terms-status="terms"
									class="google-btn social-btn mb-3"
									@termsError="shwoTermsError"
								/>
								<social-btn
									for="email"
									:terms-status="terms"
									class="email-btn social-btn"
									@termsError="shwoTermsError"
									@click.native="email_link"
								/>
								<span v-if="terms_error" class="terms_error_msg">{{ $t('form.rules.terms.valid') }}</span>
							</div>
						</div>
						<div class="signup-letter">
							<nuxt-link :to="{ path: '/community' }">
								<div class="skip-btn text-center text-uppercase">
									{{ $t('skip') }}
								</div>
							</nuxt-link>
						</div>
					</div>
					<div ref="step-one" class="sign-step-one" :class="{ active: showstepTwo, in_active: !showstepTwo}">
						<sign-form ref="signForm" :terms-status="terms" @sendOtp="showStepTwo" @emailback="emailback" />
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
								<Pin ref="pin" :invalid="showDigitError" @enter="validate" @change="pinChange" @complete="pinChange" />
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
							{{ $t('can_not_received') }}
							<span @click="requestOtp"> {{ $t('resend_code') }}</span>
						</div>
					</div>
				</div>
			</div>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import SocialBtn from '~/components/Social-Button';
import Brand from '~/components/common/Brand';
import SignForm from '~/components/Sign-Form';
import Inviter from '~/components/Inviter';
import { loginWithPIN, requestOtp } from '~/services/otp';
import Pin from '~/components/Pin';
import { DEFAULT_LANDING } from '~/store/squad';
import { fetchUser } from '~/services/user';

export default {
	components: {
		'social-btn': SocialBtn,
		'sign-form': SignForm,
		Pin,
		Brand,
		Inviter,
	},
	asyncData({ store, redirect }) {
		if (store.state.socket.isAuth) {
			redirect(DEFAULT_LANDING);
		}
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
		inviter: null,
	}),
	computed: {
		...mapState([
			'socket',
			'merchant',
			'squad',
		]),
	},
	watch: {
		$route: {
			immediate: true,
			handler() {
				this.setUser();
			},
		},
		squad: {
			deep: true,
			immediate: true,
			handler(value) {
				if (value.route.name === 'user-id') {
					this.$router.push({ path: '/', query: { userId: value.route.params.id } });
				}
			},
		},
	},
	mounted () {
		this.$root.$emit('guestToolbarHide', {});
		setTimeout(() => {
			this.$refs.login.style.background = 'linear-gradient(90deg, rgba(var(--brand-rgb-color), 0.3) 0%, rgba(var(--brand-rgb-color), 0.65) 40%, rgba(var(--brand-rgb-color), 1) 100%)';
		});
	},
	methods: {
		showStepTwo (email) {
			this.email = email;
			this.showstepTwo = false;
			this.showstepThree = true;
		},
		email_link() {
			if (this.terms) {
				this.showstepTwo = true;
				this.showstepOne = false;
			} else {
				this.shwoTermsError();
			}
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
		showTerms() {
			window.parent.postMessage(JSON.stringify({
				type: 'open-link',
				link: 'https://www.squadded.co/privacy-policy',
			}), '*');
		},
		setUser() {
			const { userId } = this.$route.query;

			if (!userId || this.inviter) {
				return;
			}
			fetchUser(userId).then(({ user }) => {
				this.inviter = user;
			});
		},
	},
	head: () => ({
		title: 'Onboarding-Login',
	}),
};
</script>

<style lang="stylus">
.login
	&-content
		background white
		border-top-left-radius 16px
		border-top-right-radius 16px
		margin-top 12px
	.skip-btn
		font-size 12px
		color #717171
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
		margin-bottom 8vw
		.form-group
			input
				padding 0
				height initial
				width initial
				margin-bottom 0
				display none
				cursor pointer

			label
				position relative
				cursor pointer

				.check_lable
					position relative
					margin 0
					border 2px solid #dbdbdb
					display inline-block
					vertical-align top
					cursor pointer
					width 26px
					height 26px
					border-radius 3.076vw

				.terms-text
					padding-left 2.36vw
					line-height 1.6

				&.error_terms .check_lable
					border-color #FD6256 !important

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
	label.term-text
		color #B8B8BA
		font-size 3.38vw
		font-weight 500
		line-height 4.92vw
		&.error_terms
			&:before
				border 2px solid #ef6256

	.sign-step-two
		display none
		transition all 0.2s ease-in-out
		margin-top: 22vw
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
		margin-bottom 0px
	@-webkit-keyframes slide-down
		0% { opacity: 0; }
		100% { opacity: 1; }
	@-moz-keyframes slide-down
		0% { opacity: 0; }
		100% { opacity: 1; }
	.otp-field .v-input__control
		height 10.76vw !important
		min-height auto !important
.signup-letter
	margin-top 10vw
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
.notification-message-resend
	height: 40px;
	padding: 0 25px;
	border-bottom: 4px red solid;
.notifications-container
	position fixed
	z-index 99
	width 100%
	.notification-message
		border-radius 0 0 15px 15px !important
		border-bottom-left-radius 20px
		border-bottom-right-radius 20px
		&::after
			content ''
			position absolute
			width calc(100% - 6vw)
			height 0.76vw
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
.signin-text
	font-weight 600
	font-size 6.5vw
	margin 16vw 0 12vw
	color black
.invite-login
	.signin-text
		margin 8vw 0
	.custom-chk
		margin-bottom 4vw
</style>
