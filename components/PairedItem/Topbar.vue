<template>
	<h3 class="d-flex justify-space-between align-center pa-2">
		<GoBackBtn ref="go-back-btn" />
		<span ref="paired-item-title" class="paired-item-title">{{ $t('pairedItem.title') }}</span>
		<span class="blank-span" />
	</h3>
</template>

<script>
import GoBackBtn from '~/components/common/GoBackBtn';

export default {
	components: {
		GoBackBtn,
	},
};
</script>
<style lang="stylus" scoped>
.paired-item-title
	font-size 4.30vw
.blank-span
	width 36px
	height 36px
</style>
