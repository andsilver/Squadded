<template>
	<v-dialog v-model="dialog" content-class="signin-dialog">
		<div class="signin-dialog-layout">
			<div>
				<img class="signin-dialog-img" src="~assets/img/logo-circled.svg">
			</div>
			<div class="signin-dialog-text">
				{{ $t('signin_dialog.text') }}
			</div>
			<div>
				<Button ref="signin-button" class="signin-button" @click.native="goToSignin">
					{{ $t('Signin') }}
				</Button>
			</div>
		</div>
	</v-dialog>
</template>

<script>
import Button from '~/components/common/Button';
export default {
	components: {
		Button,
	},
	props: {
		showDialog: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({}),
	computed: {
		dialog: {
			get() {
				return this.showDialog;
			},
			set(val) {
				this.$emit('update:showDialog', val);
			},
		},
	},
	methods: {
		goToSignin() {
			this.dialog = false;
			this.$router.push('/');
		},
	},
};
</script>

<style lang="scss" scoped>
.signin-dialog-layout {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	text-align: center;
	align-items: center;

	.signin-dialog-img {
		height: 8vh;
	}

	.signin-dialog-text {
		font-size: 14px;
	}

	.signin-button {
		width: 120px;
	}
}
</style>
