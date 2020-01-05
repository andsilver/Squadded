<template>
	<v-img
		:key="item.img"
		:src="item.img"
		@click="() => $emit('open')"
	>
		<slot />
		<ReSquaddButton
			v-if="resquadd"
			class="reSquaddButton"
			:item="item"
		/>
	</v-img>
</template>

<script>
import ReSquaddButton from '~/components/ReSquaddButton';

export default {
	components: {
		ReSquaddButton,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
		resquadd: {
			type: Boolean,
			default: true,
		},
	},
};
</script>

<style lang="stylus" scoped>
.gallery-card .multi-item .v-image
	height 100.384vw

.photo-create .multi-item .v-image
	height 40.39vh
</style>
