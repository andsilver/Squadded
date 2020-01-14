<template>
	<v-form
		ref="form"
		v-model="valid"
		lazy-validation
	>
		<div v-if="!signup">
			<div class="my-4">
				<span>{{ $t('or') }}</span>
			</div>
			<v-text-field
				v-if="!signup"
				v-model="token"
				:label="Token"
			/>
			<v-btn
				class="full-width my-4"
				color="primary"
				large
				depressed
				@click="injectToken"
			/>
		</div>

		<div v-if="!signup" class="my-4">
			<span>{{ $t('or') }}</span>
		</div>

		<v-text-field
			v-if="signup"
			v-model="name"
			:rules="nameRules"
			:label="$t('form.name')"
			required
		/>

		<v-text-field
			ref="email-field"
			v-model="email"
			:rules="emailRules"
			:label="$t('form.email')"
			type="email"
			required
			@update:error="(e) => errorHandle(e, 'email')"
		/>

		<v-text-field
			v-if="otpRequested"
			ref="pin-field"
			v-model="pin"
			:rules="pinRules"
			:label="$t('form.pin')"
			type="number"
			required
			@update:error="(e) => errorHandle(e, 'pin')"
		/>

		<v-checkbox
			v-if="signup"
			v-model="terms"
			:rules="[v => !!v || $t('form.terms.message')]"
			:label="$t('form.terms.label')"
			required
			:hide-details="true"
			class="small"
		/>

		<v-checkbox
			v-if="signup"
			v-model="allowContact"
			:rules="[v => !!v || $t('form.allowContact.message')]"
			:label="$t('form.allowContact.label')"
			required
			:hide-details="true"
			class="small"
		/>

		<v-checkbox
			v-if="signup"
			v-model="above16"
			:rules="[v => !!v || $t('form.age.messsage')]"
			:label="$t('form.age.label')"
			required
			:hide-details="true"
			class="small"
		/>

		<v-btn
			v-if="signup"
			class="full-width my-4"
			color="primary"
			large
			depressed
			@click="validate"
		>
			{{ $t('form.signup') }}
		</v-btn>

		<v-btn
			v-if="!signup"
			ref="signin-button"
			class="full-width my-4"
			color="primary"
			large
			depressed
			:disabled="loginDisabled"
			@click="() => emailLogin()"
		>
			{{ !otpRequested ? $t('form.send_me_otp') : $t('form.login') }}
		</v-btn>

		<div class="m2">
			<span v-if="signup">{{ $t('form.onboard') }} <a @click="toggle">{{ $t('form.login') }}</a></span>
			<span v-if="!signup">{{ $t('form.needAnAccount') }} <a @click="toggle">{{ $t('form.signup') }}</a></span>
		</div>
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
</style>

<script>
import { requestOtp, loginWithPIN } from '~/services/otp';

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
			otpRequested: false,
			errors: {
				email: true,
				pin: true,
			},
		};
	},
	computed: {
		loginDisabled() {
			return this.otpRequested ? (this.errors.email || this.errors.pin) : this.errors.email;
		},
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
				requestOtp(this.email);
				this.otpRequested = true;
				this.errors.email = false;
				return;
			}

			loginWithPIN(+this.pin, this.email).then(({ userId, token }) => {
				localStorage.setItem('userToken', token);
			});
		},
		errorHandle(event, field) {
			this.errors[field] = event;
		},
	},
};
</script>
