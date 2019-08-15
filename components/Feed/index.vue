<template lang="html">

	<section class="feed">
		<span v-if="!items.length">{{ $t('feed.isEmpty') }}</span>
	</section>

</template>

<script lang="js">
	export default  {
		name: 'feed',
		props: {
			items: {
				type: Array,
				default: [],
			}
		},
		mounted() {

		},
		data() {
			return {
			}
		},
		methods: {

		},
		computed: {

		}
}
</script>

<style scoped lang="scss">
	.feed {

	}
</style>
