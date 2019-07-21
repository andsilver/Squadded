<template>
	<v-form
		ref="form"
		v-model="valid"
		lazy-validation
	>
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
			v-model="email"
			:rules="emailRules"
			:label="$t('form.email')"
			type="email"
			required
		/>

		<v-text-field
			v-model="password"
			:rules="passwordRules"
			:label="$t('form.password')"
			type="password"
			required
		/>

		<div v-if="!signup" class="text-xs-right">
			<a nuxt to="forgot" class="normal">
				{{ $t('form.forgot') }}
			</a>
		</div>

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
			class="full-width my-4"
			color="primary"
			depressed
			@click="validate"
		>
			{{ signup ? $t('form.signup') : $t('form.login') }}
		</v-btn>
		<div class="m2">
			<span v-if="signup">Already onboard? <a @click="toggle">{{ $t('form.login') }}</a></span>
			<span v-if="!signup">Need an account? <a @click="toggle">{{ $t('form.signup') }}</a></span>
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
	data: function () {
		return {
			valid: true,
			signup: true,
			name: '',
			nameRules: [
				v => !!v || this.$t('form.rules.name.required'),
			],
			email: '',
			emailRules: [
				v => !!v || this.$t('form.rules.email.required'),
				v => /.+@.+/.test(v) || this.$t('form.rules.email.valid')
			],
			password: '',
			passwordRules: [
				v => !!v || this.$t('form.rules.password.required'),
				v => (v && v.length >= 8) || this.$tc('form.rules.password.length', 8),
			],
			terms: false,
			allowContact: false,
			above16: false,
		}
	},
	methods: {
		validate () {
			if (this.$refs.form.validate()) {
				this.snackbar = true
			}
		},
		toggle () {
			this.signup = !this.signup;
			this.$refs.form.reset();
		}
	}
}
</script>
