<template>
	<v-img
		:key="item.img"
		:src="item.img"
		@click="() => $emit('open')"
	>
		<slot />
		<ReSquaddButton
			v-if="resquad"
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
		resquad: {
			type: Boolean,
			default: true,
		},
	},
};
</script>

<style lang="stylus" scoped>
</style>
