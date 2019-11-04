<template>
	<button @click="login">
		<img :src="src" :alt="alt">
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
			src: `./img/${this.for}-btn.svg`,
			alt: `${fullname[this.for]} logo button`,
		};
	},
	methods: {
		login () {
			Social.oauth(fullname[this.for]);
		},
	},
};
</script>
