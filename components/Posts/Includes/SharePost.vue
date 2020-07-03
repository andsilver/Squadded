<template>
	<v-card>
		<v-card-title class="share_title">
			{{ $t('post.share') }}
			<v-btn icon class="close-dialog" @click.native="hide">
				<v-icon size="3.69vw">
					sqdi-close-cross
				</v-icon>
			</v-btn>
		</v-card-title>
		<v-card-text class="share_url">
			<v-text-field ref="post-link" :value="postLink" />
		</v-card-text>
		<div class="d-flex justify-space-around">
			<div
				v-for="(method, index) of methods"
				:key="index"
				class="d-flex flex-column justify-center align-center"
				style="width: 23vw"
				@click="() => action(method)"
			>
				<div class="method-icon d-flex align-center justify-center">
					<img v-if="method.title === 'messenger'" :width="32" :height="32" src="~assets/img/messenger.svg">
					<img
						v-else-if="method.title === 'whatsapp'"
						:width="32"
						:height="32"
						src="~assets/img/whatsapp.svg"
					>
					<img v-else-if="method.title === 'email'" :width="30" :height="30" src="~assets/img/envelope.svg">
					<img v-else src="~assets/img/copy-link.svg" :width="25" :height="25">
				</div>
				<div class="mt-2 caption">
					{{ $t('invite_your_friends.' + method.title) }}
				</div>
			</div>
		</div>
		<input ref="shorturl" v-model="postLink" class="link-box">
	</v-card>
</template>

<script>
import { copy } from '~/utils/copy';

export default {
	props: {
		postLink: {
			type: String,
			required: true,
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
				icon: 'copy-link.svg',
			},
		],
		copied: false,
	}),
	methods: {
		hide () {
			this.$emit('hideShowShare');
		},
		action(method) {
			this.$emit('shared');
			const content = this.$t('post.share_link.content', { merchant: this.$store.state.merchant.id });
			switch (method.title) {
			case 'messenger':
				window.open(`https://www.facebook.com/dialog/send?app_id=${process.env.FB_APP_ID}&link=${this.postLink}&redirect_uri=${window.location.origin}`);
				break;
			case 'copy_link':
				this.$refs.shorturl.select();
				copy();
				method.title = 'copied';
				setTimeout(() => (method.title = 'copy_link'), 1000);
				break;
			case 'email':
				window.open(`mailTo:?subject=${this.$t('post.share_link.subject', { merchant: this.$store.state.merchant.id })}&body=${content}%0A${this.postLink}`);
				break;
			case 'whatsapp':
				window.open(encodeURI(`https://api.whatsapp.com/send?text=${content}\n${this.postLink}`));
				break;
			}
		},
	},
};
</script>

<style lang="stylus" scoped>

.share_box
	.close-dialog
		right 0
	.v-card
		border-radius 0
		box-shadow none
		background transparent
	.share_title
		font-size 4.30vw
		font-weight 700
		color #000000
		padding 0
		display flex
		justify-content space-between
	.share_url
		padding 0
		.v-input
			background transparent
	.copy_btn
		width 46.92vw
		margin 0 auto
		padding 4.76vw
		height auto
		font-size 2.91vw
		font-weight 700
		display block
		border-radius 3.07vw
</style>
<style lang="scss" scoped>
.method-icon {
	width: 17.84vw;
	height: 17.84vw;
	border-radius: 4.92vw;
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
