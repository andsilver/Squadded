<template>
	<v-form
		ref="form"
		v-model="valid"
		lazy-validation
	>
		<div
			v-if="!signup"
			class="my-4"
		>or</div>
		<v-text-field
			v-if="signup"
			v-model="name"
			:rules="nameRules"
			label="Name"
			required
		/>

		<v-text-field
			v-model="email"
			:rules="emailRules"
			label="E-mail"
			type="email"
			required
		/>

		<v-text-field
			v-model="password"
			:rules="passwordRules"
			label="Password"
			type="password"
			required
		/>

		<div v-if="!signup" class="text-xs-right">
			<a nuxt to="forgot" class="normal">
				Forgot password?
			</a>
		</div>

		<v-checkbox
			v-if="signup"
			v-model="terms"
			:rules="[v => !!v || 'You must accept the Terms to continue!']"
			label="I have read and accept the Terms"
			required
			:hide-details="true"
			class="small"
		/>

		<v-checkbox
			v-if="signup"
			v-model="allowContact"
			:rules="[v => !!v || 'You must allow us to contact you!']"
			label="I allow Squad to contact me"
			required
			:hide-details="true"
			class="small"
		/>

		<v-checkbox
			v-if="signup"
			v-model="above16"
			:rules="[v => !!v || 'You must be older than 16 to continue!']"
			label="I certify that I am 16 or older"
			required
			:hide-details="true"
			class="small"
		/>

		<v-btn
			class="full-width my-4"
			color="primary"
			depressed
			@click="validate"
		>
			Sign up
		</v-btn>
		<div class="m2">
			<span v-if="signup">Already onboard? <a @click="signup = !signup">Login</a></span>
			<span v-if="!signup">Need an account? <a @click="signup = !signup">Sign up</a></span>
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
		height 50px
		border-radius 4px
		font-weight normal
		text-transform unset
</style>

<script>
export default {
	data: () => ({
		valid: true,
		signup: true,
		name: '',
		nameRules: [
			v => !!v || 'Name is required',
		],
		email: '',
		emailRules: [
			v => !!v || 'E-mail is required',
			v => /.+@.+/.test(v) || 'E-mail must be valid'
		],
		password: '',
		passwordRules: [
			v => !!v || 'Password is required',
			v => (v && v.length >= 8) || 'Name must contain more than 8 characters',
		],
		terms: false,
		allowContact: false,
		above16: false,
	}),
	methods: {
		validate () {
			if (this.$refs.form.validate()) {
				this.snackbar = true
			}
		},
	}
}
</script>
