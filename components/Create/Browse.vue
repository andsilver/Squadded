<template>
	<button @click="browse">
		<input ref="input-file" type="file" accept="image/jpeg,image/jpg,image/png" @change="read">
		<img src="~assets/img/gallery.svg">
		<span>{{ $t('photo.browse') }}</span>
	</button>
</template>

<script>
import { toBase64 } from '~/utils/toBase64';

export default {
	created () {
		this.id = `${Math.floor(Math.random())}${Date.now()}`;
	},
	methods: {
		browse () {
			this.$refs['input-file'].value = null;
			this.$refs['input-file'].click();
		},
		async read () {
			const file = this.$refs['input-file'].files[0];
			if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
				this.$emit('error');
				return;
			}
			const base64 = await toBase64(file);
			const image = base64.length ? base64 : null;
			image && this.$emit('open', { image, file, type: file.type });
		},
	},
};
</script>

<style lang="stylus" scoped>
button
	display flex
	flex-direction column
	align-items center
	font-size 0.85em
	font-weight 600
	border 1.5px solid #ececec
	border-radius 10px

	margin 6.15vw auto 0
	width 70.76vw
	padding 9.61vw 65px

	img
		width 40pt
		margin-bottom 8pt

	input
		display none
</style>
