<template>
	<button @click="login">
		<span>{{ title }}</span>
	</button>
</template>

<script>
import { mapState } from 'vuex';
import Social from '~/classes/social';

const fullname = {
	fb: 'facebook',
	inst: 'D.C.M Jennyfer',
};
export default {
	props: {
		for: {
			type: String,
			default: 'fb',
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
			const { userId, postId } = this.$route.query;
			const params = {
				merchantId: this.merchant.id,
				origin: 'normal',
			};
			if (userId) {
				params.userId = userId;
				params.origin = 'invitation';
			} else if (postId) {
				params.postId = postId;
				params.origin = 'share';
			}
			Social.oauth(fullname[this.for], params);
		},
	},
};
</script>

<style lang="stylus">
.social-btn
	width 100%
	border-radius 3.07vw
	border 0.46vw solid #000
	height 12.30vw
	&.instagram-btn
		background-image url('~assets/img/dcm-logo.svg')
		background-size 10.84vw
		background-position 15.69vw center
		width 84.92vw
		margin 0 auto
		display block
		background-color #790fff
		border 3px solid #790fff
		border-radius 3.07vw
		color #fff
		text-align right
		padding-right 17.2vw
	&.facebook-btn
		background-image url('~assets/img/facebook-logo.svg')
		background-size 3.84VW
		background-position 19.23vw center
		width 84.92vw
		margin 0 auto
		display block
		background-color #1877f2
		border 3px solid #1877f2
		border-radius 3.07vw
		color #fff
		text-align right
		padding-right 28.98vw
		margin-bottom 5.38vw

</style>
