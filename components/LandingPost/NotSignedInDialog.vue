<template>
	<v-dialog v-model="show" persistent>
		<v-card>
			<v-card-title />
			<v-card-text ref="text" class="text">
				{{ $t('landing_post.interact_with_user', { user: user.screenName }) }}
			</v-card-text>
			<v-card-actions class="d-flex justify-center">
				<Button ref="sign-in-btn" class="ma-0 mr-2 flex-grow-1" @click.native="signin">
					{{ $t('landing_post.sign_in') }}
				</Button>
				<v-btn ref="skip-btn" outlined depressed class="skip-btn flex-grow-1" @click="show = false">
					{{ $t('landing_post.skip') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
		show: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		signin() {
			this.$router.push('/');
		},
	},
};
</script>

<style lang="stylus" scoped>
.skip-btn
	font-size 0.6em
	font-weight 700
	letter-spacing 1px
	border-radius 10px
.text
	color black !important
	font-weight 600
	padding 12px
</style>
