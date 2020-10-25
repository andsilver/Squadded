<template>
	<button @click="login">
		<span>{{ $t(title) }}</span>
	</button>
</template>

<script>
import { mapState } from 'vuex';
import Social from '~/classes/social';

const fullname = {
	facebook: 'signin.facebook_signin',
	inst: 'D.C.M Jennyfer',
	google: 'signin.google_signin',
	email: 'signemail',
};
export default {
	props: {
		for: {
			type: String,
			default: 'fb',
		},
		termsStatus: {
			type: Boolean,
			default: false,
		},
	},
	data: function () {
		return {
			title: `${fullname[this.for]}`,
		};
	},
	computed: {
		...mapState([
			'merchant',
		]),
	},
	methods: {
		login () {
			if (!this.termsStatus) {
				this.$emit('termsError');
			} else {
				if (this.for === 'email') {
					return;
				}
				const { userId, postId } = this.$route.query;
				const params = {
					merchantId: this.merchant.id,
					origin: 'normal',
					language: this.$root.$i18n.fallbackLocale,
				};
				if (userId) {
					params.originUserId = userId;
					params.origin = 'invitation';
				} else if (postId) {
					params.originPostId = postId;
					params.origin = 'share';
				}
				Social.oauth(this.for, params);
			}
		},
	},
};
</script>

<style lang="stylus">
.social-btn
	width 100%
	border-radius 8px
	border 1px solid #bdbdbd
	padding 6px 4px
	text-align center
	display block
	background-position 3%
	background-size 6vw
	font-size 4.30vw
	font-weight 500

	&.instagram-btn
		background-image url('~assets/img/dcm-logo.svg')
		background-size 10.84vw
		background-position 15.69vw center
		width 84.92vw
		margin 0 auto
		display block
		background-color #790fff
		border 3px solid #790fff
		color #fff
		text-align right
		padding-right 17.2vw
	&.facebook-btn
		background-image url('~assets/img/facebook.svg')

	&.google-btn
		background-image url('~assets/img/google.svg')

	&.email-btn
		background-image url('~assets/img/mail.svg')
</style>
