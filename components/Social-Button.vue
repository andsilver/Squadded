<template>
	<button @click="login">
		<span>{{ title }}</span>
	</button>
</template>

<script>
import Social from '~/classes/social';

const fullname = {
	fb: 'facebook',
	inst: 'instagram',
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
	methods: {
		login () {
			Social.oauth(fullname[this.for]);
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
		margin-left 3.61vw
		background-image url('~assets/img/instagram-logo.svg')
		background-size 5.24VW
		background-position 9.5vw center
		padding-left 7.08VW
	&.facebook-btn
		background-image url('~assets/img/facebook-logo.svg')
		background-size 2.67VW
		background-position 9vw center
		padding-left 3.08VW
</style>
