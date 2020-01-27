<template>
	<v-form
		ref="form"
		v-model="valid"
		lazy-validation
	>
		<div class="text-sec">
			<h3>
				{{ $t('UseOneTimeCode') }}
			</h3>
			<span>{{ $t('noPasswordRemember') }}</span>
		</div>
		<v-text-field
			ref="email-field"
			v-model="email"
			:rules="emailRules"
			:label="$t('form.email')"
			type="email"
			required
			solo
			flat
			dense
			class="email-field"
			:class="{ error_email: showErrorMsg}"
			hide-details
		/>
		<span v-if="showErrorMsg" class="email-velid-message">{{ $t('form.rules.email.valid') }}</span>
		<span class="comment-msg">{{ $t('Messageregarding') }}</span>
		<v-btn
			v-if="signup"
			ref="signup-otp-btn"
			class="full-width sendmeotp-btn"
			color="primary"
			large
			depressed
			@click="() => emailLogin()"
		>
			{{ $t('form.send_me_otp') }}
		</v-btn>
	</v-form>
</template>

<style lang="stylus">
.v-form
	.small.v-input
		margin-top 0
		.v-label
			font-size 13px
		.v-messages:not(.error--text)
			display none
	.v-btn
		font-size 16px
		text-transform unset
	.text-sec
		margin-top 7.73vw
		text-align center
		margin-bottom 6.46vw
		h3
			font-size 4.30vw
			font-weight 700
			margin-bottom 7.38vw
		span
			font-size 3.69vw
			color #000000
			line-height 4.92vw
			font-weight 500
	span.email-velid-message
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
	span.comment-msg
		color #B8B8BA
		font-weight 500
		font-size 3.38vw
		text-align center
		display block
		line-height 4.61vw
		margin-bottom 5.89vw
		margin-top 2.26vw
	button.full-width.sendmeotp-btn
		display block
		width 43.84vw
		margin 0 auto
		background-color #000000 !important
		border-radius 3.07vw
		height 12.30vw !important
		font-size 2.61vw
		font-weight 700
		line-height 4.3vw
		letter-spacing 2px
		text-transform uppercase
.email-field
	border 0.30vw solid #DBDBDB
	border-radius 3.07vw
	height 10.76vw
	input, label
		font-size 3.69vw
		color #000000 !important
		width 100%
		margin-top 2px
		text-align center
	input
		z-index 99
	.v-input__control
		height 10.76vw !important
		min-height auto !important
.email-field.error_email
	border 0.3vw solid #FD6256
</style>

<script>
import { requestOtp } from '~/services/otp';

export default {
	data: function () {
		return {
			Token: '',
			valid: true,
			signup: true,
			name: '',
			nameRules: [
				v => !!v || this.$t('form.rules.name.required'),
			],
			email: '',
			emailRules: [
				v => !!v || this.$t('form.rules.email.required'),
				v => /.+@.+/.test(v) || this.$t('form.rules.email.valid'),
			],
			password: '',
			passwordRules: [
				v => !!v || this.$t('form.rules.password.required'),
				v => (v && v.length >= 8) || this.$tc('form.rules.password.length', 8),
			],
			pin: null,
			pinRules: [
				v => !!v || this.$t('form.rules.pin.required'),
				v => (v && v.length === 4 && Number.isInteger(+v)) || this.$t('form.rules.pin.valid'),
			],
			terms: false,
			allowContact: false,
			above16: false,
			token: '',
			showErrorMsg: false,
		};
	},
	methods: {
		validate () {
			if (this.$refs.form.validate()) {
				this.snackbar = true;
			}
		},
		toggle () {
			this.signup = !this.signup;
			this.$refs.form.reset();
		},
		injectToken() {
			localStorage.setItem('userToken', this.token);
		},
		emailLogin() {
			if (!this.otpRequested) {
				if (/.+@.+\..+/.test(this.email)) {
					this.showErrorMsg = false;
					requestOtp(this.email);
					this.$emit('sendOtp', this.email);
				} else {
					this.showErrorMsg = true;
				}
			}

			/* loginWithPIN(+this.pin, this.email).then(({ userId, token }) => {
				localStorage.setItem('userToken', token);
			}); */
		},
	},
};
</script>
