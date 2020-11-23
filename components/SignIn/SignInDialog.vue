<template>
	<v-dialog v-model="dialog" content-class="signin-dialog">
		<div class="signin-dialog-layout d-flex flex-column align-center justify-space-around">
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
			<v-btn icon class="close-btn" @click="dialog = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</div>
	</v-dialog>
</template>

<script>
import Button from '~/components/common/Button';
import { signOut } from '~/plugins/init/ws';
import { USER_TOKEN_KEY } from '~/consts';

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

			if (this.$store.state.socket.isAuth) {
				const squaddedToken = localStorage.getItem(USER_TOKEN_KEY);
				return signOut(this.$store, this.$router, { path: '/', query: { squaddedToken } });
			}
			this.$router.push('/');
		},
	},
};
</script>

<style lang="scss" scoped>
.signin-dialog-layout {
	height: 100%;
	text-align: center;
	position: relative;

	.signin-dialog-img {
		height: 8vh;
	}

	.signin-dialog-text {
		font-size: 14px;
	}

	.signin-button {
		width: 120px;
	}

	.close-btn {
		position: absolute;
		top: -24px;
		right: -24px;
	}
}
</style>
