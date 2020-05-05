<template>
	<Button
		ref="next-button"
		class="next-button"
		:disabled="disabled"
	>
		{{ $t('Next') }}
	</Button>
</template>

<script>
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
	},
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="stylus" scoped>
.next-button
	width 42.46vw;
	height 12.30vw !important
	display block
	&.disable_btn
		background-color rgba(184,184,186,0.3) !important
</style>
