<template>
	<section class="grid my-3">
		<Item />
		<Item />
	</section>
</template>

<script>
import Item from './item.vue';

export default {
	components: {
		Item,
	},
};
</script>

<style lang="stylus" scoped>
.grid
	grid-template-columns 1fr 1fr
	grid-gap 20px
</style>
