<template>
	<LargeButton
		:img="require('@/assets/img/capture.svg')"
		:label="$t('photo.capture')"
		@click.native="browse"
	>
		<input ref="input-file" type="file" capture="camera" accept="image/jpeg,image/jpg,image/png" @change="read">
	</LargeButton>
</template>

<script>
import { toBase64 } from '~/utils/toBase64';
import LargeButton from '~/components/common/LargeButton';

export default {
	components: {
		LargeButton,
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
input
	display none
</style>
