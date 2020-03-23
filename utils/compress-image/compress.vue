<template>
	<ImageUploader
		v-show="false"
		ref="resizer"
		:max-width="maxWidth"
		:quality="quality"
		accept="image/jpeg,image/jpg,image/png"
		output-format="verbose"
		auto-rotate
		@input="setImage"
		@onComplete="completeCompress"
	/>
</template>
<script>
import ImageUploader from 'vue-image-upload-resize';

export default {
	components: {
		ImageUploader,
	},
	props: {
		maxWidth: {
			type: Number,
			default: 200,
		},
		quality: {
			type: Number,
			default: 1,
		},
	},
	mounted () {
		this.init();
	},
	methods: {
		setImage() {},
		completeCompress() {},
	},
};
</script>
