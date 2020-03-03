<template>
	<v-container class="flex-grow-1 pd">
		<v-layout
			v-if="!socket.isPendingAuth"
			column
			class="justify-space-between"
		>
			<div class="login">
				<div class="text-center">
					<div class="brand-section">
						<!-- <div class="brand-title">
							{{ $t('ShopWithYourFriendsOn') }}
						</div> -->
						<img src="../assets/img/bglogin.svg" class="b-logo">
					</div>
				</div>
				<div class="signin-main-section">
					<div class="sign-in">
						{{ $t('Signin') }}
					</div>
					<div class="poweredby">
						{{ $t('PoweredBy') }}
						<img src="../assets/img/squaddedcyrcleB_trim.svg" class="powerdby-image">
					</div>
				</div>
				<div ref="socialstep-one" class="social_step-one" :class="{ active: showstepOne, in_active: !showstepOne}">
					<div class="social-text-section" :class="{ hide_socila: showstepTwo}">
						<div class="social">
							<social-btn for="fb" class="facebook-btn social-btn" />
							<social-btn for="inst" class="instagram-btn social-btn" />
						</div>
						<!-- <div class="or-section">
							<span>{{ $t('or') }}</span>
						</div> -->
					</div>
					<div class="text-center">
						<div class="signemail" @click="email_link">
							{{ $t('signemail') }}
						</div>
						<div class="term-section">
							<p>{{ $t('Wecare') }}</p>
						</div>
						<div class="custom-chk">
							<div class="form-group">
								<input id="html" type="checkbox">
								<label class="term-text" for="html">{{ $t('agree_left') }} <span> <a href="javascript:void(0);">  {{ $t('agree_right') }} </a> </span> </label>
							</div>
						</div>
					</div>
					<div class="signup-letter">
						<nuxt-link :to="{ path: '/community' }">
							<h5 class="text-right">
								{{ $t('sign_up_later') }}
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
					<sign-form ref="sign-form" @sendOtp="showStepTwo" />
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
					<v-form
						ref="form"
						@submit.prevent
						@submit="validate"
					>
						<div class="pin_sec">
							<v-text-field
								ref="pin-field1"
								v-model="p1"
								type="number"
								solo
								flat
								dense
								class="otp-field pin_opt"
								:class="{ invalid: showError }"
								@input="p1up"
							/>
							<v-text-field
								ref="pin-field2"
								v-model="p2"
								type="number"
								solo
								flat
								dense
								class="otp-field pin_opt"
								:class="{ invalid: showError }"
								@input="p2up"
								@keyup.native.delete="backPin('pin-field1')"
							/>
							<v-text-field
								ref="pin-field3"
								v-model="p3"
								type="number"
								solo
								flat
								dense
								class="otp-field pin_opt"
								:class="{ invalid: showError }"
								@input="p3up"
								@keyup.native.delete="backPin('pin-field2')"
							/>
							<v-text-field
								ref="pin-field4"
								v-model="p4"
								type="number"
								solo
								flat
								dense
								class="otp-field pin_opt"
								:class="{ invalid: showError }"
								@keyup.native.delete="backPin('pin-field3')"
							/>
						</div>
						<span v-if="showError" ref="error-message" class="error-message">{{ $t('form.rules.pin.valid') }}</span>
						<v-btn
							ref="signup-validate-btn"
							class="full-width validate-btn"
							color="primary"
							type="submit"
							large
							depressed
						>
							{{ $t('validate') }}
						</v-btn>
					</v-form>
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
import SignForm from '~/components/Sign-Form.vue';
import { loginWithPIN, requestOtp } from '~/services/otp';

export default {
	components: {
		'social-btn': SocialBtn,
		'sign-form': SignForm,
	},
	data: () => ({
		showstepTwo: false,
		showstepOne: true,
		showstepThree: false,
		email: null,
		pin: null,
		showError: false,
		p1: null,
		p2: null,
		p3: null,
		p4: null,
	}),
	computed: {
		...mapState([
			'socket',
		]),
	},
	methods: {
		p1up () {
			if (this.p1 !== '') {
				this.$refs['pin-field2'].focus();
			}
		},
		p2up () {
			if (this.p2 !== '') {
				this.$refs['pin-field3'].focus();
			}
		},
		p3up () {
			if (this.p3 !== '') {
				this.$refs['pin-field4'].focus();
			}
		},
		backPin (refEle) {
			this.$refs[refEle].focus();
		},
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
			this.pin = null;
		},
		emailback() {
			this.showstepTwo = false;
			this.showstepOne = true;
			this.showError = false;
			this.pin = null;
		},
		validate() {
			loginWithPIN(+this.pin, this.email).then(({ error, token }) => {
				if (error) {
					this.showError = true;
					return;
				}
				this.showError = false;
				window.postMessage(JSON.stringify({
					type: 'loggedIn',
					userToken: token,
				}));
			});
		},
		requestOtp() {
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
    padding 0
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
		.v-input.otp-field
			height 10.79vw
			border-bottom 0.3vw solid #707070
			border-radius 0
			font-size 3.69vw
			color #000000
			line-height 4.92vw
			font-weight 400
			margin-bottom 3.15vw
			width 9.69vw
			flex inherit
			&.invalid
				border 1px solid #FD6256
		.otp-field input,
		.otp-field label
			font-size 3.69vw
			color #000000
			line-height 4.92vw
			font-weight 400
			text-align center
			width 100%
			margin-top 2px
		.otp-field input
			color #FD6256
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
		.form-group label:before
			content''
			-webkit-appearance none
			border 2px solid #DBDBDB
			display inline-block
			position relative
			vertical-align middle
			cursor pointer
			margin-right 2.36vW
			width 7.69vw
			height 7.69vw
			border-radius 2.69vw
		.form-group input:checked + label:after
			content ''
			display block
			position absolute
			top -1.4px
			left 4.2px
			width 5.38vw
			height 5.38vw
			border-radius 2vw
			background #FD6256
			@media screen and (min-width 414px)
				top -0.3px
				left 4.2px
			@media screen and (min-width 360px)
				top -1px
				left 4.4px
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
	.signin-main-section
		position absolute
		top 10.6%
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
	.sign-step-two
		display none
		transition all 0.2s ease-in-out
		margin-top: 25.35vw;
		padding 0 7.69vw
		.pin_sec
			display flex
			justify-content space-between
			max-width 52.76vw
			margin 0 auto
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
		overflow hidden;
		transition max-height 0.2s ease-out
		max-height 500px
		height auto
		padding-top 38.35vw
		&.hide_socila
			max-height 0
	.otp-field .v-input__control
		height 10.76vw !important
		min-height auto !important
.signup-letter
	margin-top 20VW
	h5
		font-size 3.69vw
		line-height 5.84vw
		font-weight 700
		padding-right 7.2vw
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

</style>
