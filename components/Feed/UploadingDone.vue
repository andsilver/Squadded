<template>
	<div ref="upload-status" class="d-flex align-center px-3 py-2" style="background: #f4f4f5">
		<img ref="image" class="mr-6" :src="image" width="38.56px" height="50px">
		<div class="d-flex align-center">
			<v-icon ref="check-icon">
				mdi-check
			</v-icon>
			<span ref="done-text" class="ml-3">{{ $t('photo.upload.done') }}</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		image: {
			type: String,
			required: true,
		},
	},
};
</script>

<style>

</style>
