<template lang="html">
	<section class="feed">
		<span v-if="!items.length">{{ $t('feed.isEmpty') }}</span>
		<v-list v-else three-line>
			<template v-for="item in items">
				<v-list-item
					:key="item.itemId"
				>
					<v-list-item-avatar>
						<v-img :src="item.img" />
					</v-list-item-avatar>

					<v-list-item-content>
						<v-list-item-title v-text="item.title" />
						<v-list-item-subtitle v-text="item.price" />
					</v-list-item-content>
					<v-progress-circular
						v-if="!item.guid"
						:width="3"
						color="primary"
						indeterminate
					/>
				</v-list-item>
			</template>
		</v-list>
	</section>
</template>

<script lang="js">
export default {
	name: 'Feed',
	props: {
		items: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
		};
	},
	computed: {

	},
	mounted() {

	},
	methods: {

	},
};
</script>

<style scoped lang="scss">
	.feed {

	}
</style>
