<template>
	<button @click="browse">
		<client-only>
			<ImageUploader
				v-show="false"
				:id="id"
				ref="input-file"
				:max-width="1024"
				capture="camera"
				accept="image/jpeg,image/jpg,image/png"
				output-format="verbose"
				@input="setImage"
				@onComplete="completeCompress"
			/>
		</client-only>
		<img src="~assets/img/capture.svg">
		<span>{{ $t('photo.capture') }}</span>
	</button>
</template>

<script>
import ImageUploader from 'vue-image-upload-resize';
import { dataURItoBlob } from '~/utils/dataUriToBlob';

export default {
	components: {
		ImageUploader,
	},
	data: () => ({
		id: null,
		input: null,
	}),
	created () {
		this.id = `${Math.floor(Math.random())}${Date.now()}`;
	},
	methods: {
		browse () {
			const el = document.getElementById(this.id);
			el.value = null;
			el.click();
		},
		setImage (input) {
			this.input = input;
		},
		completeCompress(e) {
			const { info, dataUrl: image } = this.input;
			const { type } = info;
			const file = dataURItoBlob(image, type);
			this.$emit('open', { image, file, type });
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

	margin 10pt auto 0
	width 70.76vw
	padding 6.15vw 65px

	img
		width 40pt
		margin-bottom 8pt

	input
		display none
</style>
