<template>
	<div>
		<div v-if="showTitle" class="title text-center mb-4">
			{{ $t('mysquad.share_private_link') }}:
		</div>
		<div class="d-flex justify-space-around">
			<div
				v-for="(method, index) of methods"
				:key="index"
				class="d-flex flex-column justify-center align-center"
				style="width: 23vw"
				@click="() => action(method)"
			>
				<div class="method-icon d-flex align-center justify-center">
					<img v-if="method.title === 'messenger'" :width="30" :height="30" src="~assets/img/messenger.svg">
					<img
						v-else-if="method.title === 'whatsapp'"
						:width="40"
						:height="40"
						src="~assets/img/whatsapp.svg"
					>
					<img v-else-if="method.title === 'email'" :width="40" :height="40" src="~assets/img/envelope.svg">
					<img v-else src="~assets/img/copy-link.png" :width="25" :height="25">
				</div>
				<div class="mt-2 caption">
					{{ $t('invite_your_friends.' + method.title) }}
				</div>
			</div>
		</div>
		<input ref="shorturl" v-model="shortURL" class="link-box">
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { getShortURL } from '~/services/short-url';
import { copy } from '~/utils/copy';
import { UserStore } from '~/store/user';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	props: {
		showTitle: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		methods: [
			{
				title: 'messenger',
				icon: 'messenger.svg',
			},
			{
				title: 'whatsapp',
				icon: 'whatsapp.svg',
			},
			{
				title: 'email',
				icon: 'envelope.svg',
			},
			{
				title: 'copy_link',
				icon: 'copy-link.png',
			},
		],
		shortURL: null,
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
	mounted() {
		this.setLink();
	},
	methods: {
		async setLink() {
			this.shortURL = await getShortURL(this.userLink, this.$store);
		},
		action(method) {
			const content = this.$t('invite_your_friends.invite_body', { merchant: this.$store.state.merchant.id });
			switch (method.title) {
			case 'messenger':
				window.open(`https://www.facebook.com/dialog/send?app_id=${process.env.FB_APP_ID}&link=${this.shortURL}&redirect_uri=${window.location.origin}`);
				break;
			case 'copy_link':
				this.$refs.shorturl.select();
				copy();
				method.title = 'copied';
				setTimeout(() => (method.title = 'copy_link'), 1000);
				break;
			case 'email':
				window.open(`mailTo:?subject=${this.$t('invite_your_friends.invite_subject')}&body=${content}%0A${this.shortURL}`);
				break;
			case 'whatsapp':
				window.open(encodeURI(`https://wa.me?text=${content}\n${this.shortURL}`));
				break;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.method-icon {
	width: 13vw;
	height: 13vw;
	border-radius: 10px;
	line-height: 0;
	box-shadow: -1px 2px 19px 1px rgba(0, 0, 0, 0.07843);
	cursor: pointer;
}
.link-box {
	display: block;
	height: 0;
}
.caption {
	font-size: 0.6rem !important;
}
</style>
