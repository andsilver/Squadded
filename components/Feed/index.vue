<template lang="html">

	<section class="feed">
		<span v-if="!items.length">{{ $t('feed.isEmpty') }}</span>
		<v-list three-line v-else>
			<template v-for="(item, index) in items">
				<v-list-item
					:key="item.name"
					@click=""
				>
					<v-list-item-avatar>
					<v-img :src="item.data.img"></v-img>
					</v-list-item-avatar>

					<v-list-item-content>
					<v-list-item-title v-html="item.data.title"></v-list-item-title>
					<v-list-item-subtitle v-html="item.data.price"></v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</template>
		</v-list>
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
