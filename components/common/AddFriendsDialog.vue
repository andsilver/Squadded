<template>
	<v-dialog v-model="showDialog" content-class="add-friends-dialog">
		<div ref="title" class="subtitle-1 font-weight-bold text-center mt-4 mb-5">
			{{ $t('mysquad.add_friends') }}
			<v-btn icon class="close-dialog" @click.native="hide">
				<v-icon size="3.69vw">
					sqdi-close-cross
				</v-icon>
			</v-btn>
		</div>
		<div class="mb-0">
			<FindFriends v-if="showDialog" ref="find-friends" />
		</div>
		<div class="d-flex black justify-center align-center pa-2 pl-4">
			<strong class="white--text subtitle-2 font-weight-bold">
				{{ $t('mysquad.share_private_link') }}
			</strong>
			<Button ref="copy-btn" class="ma-0 ml-4" style="background: #fd6256; height: 9.23vw;" @click.native="copy">
				{{ copied ? $t('invite_your_friends.copied') : $t('invite_your_friends.copy_link') }}
			</Button>
		</div>
		<input ref="shorturl" v-model="shortURL" class="link-box">
	</v-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import FindFriends from '~/components/common/FindFriends';
import { copy } from '~/utils/copy';
import Button from '~/components/common/Button';
import { UserStore } from '~/store/user';
import { getShortURL } from '~/services/short-url';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		Button,
		FindFriends,
	},
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		shortURL: null,
		showDialog: false,
		copied: false,
	}),
	computed: {
		...userState(['me']),
		target() {
			const { siteUrl, siteTitle } = this.$store.state.merchant;
			return {
				id: this.me.userId,
				url: siteUrl,
				title: siteTitle,
				invite: true,
			};
		},
		userLink() {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			return `${API_ENDPOINT}/community/profile?t=${btoa(target)}`;
		},
	},
	watch: {
		show() {
			this.showDialog = this.show;
		},
		showDialog(value) {
			if (value) {
				return;
			}
			this.$emit('close', value);
		},
	},
	mounted() {
		this.showDialog = this.show;
		this.setLink();
	},
	methods: {
		async setLink() {
			this.shortURL = await getShortURL(this.userLink, this.$store);
		},
		copy() {
			this.$refs.shorturl.select();
			copy();
			this.copied = true;
			setTimeout(() => (this.copied = false), 1000);
		},
		hide() {
			this.$emit('close', false);
		},
	},
};
</script>

<style lang="scss" scoped>
.link-box {
	display: block;
	height: 0;
}
</style>
<style lang="scss">
.add-friends-dialog {
	background: white;
	margin: 2px;
	border-radius: 9.230vw;
}
.close-dialog {
	position: absolute;
	right: 15px;
}
</style>
