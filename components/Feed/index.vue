<template lang="html">
	<section class="feed">
		<span v-if="!items.length">{{ $t('feed.isEmpty') }}</span>
		<v-list v-else three-line>
			<template v-for="post in items">
				<v-list-item
					:key="post.correlationId || post.guid"
				>
					<v-list-item-avatar>
						<v-img :src="post.data.item.img" />
					</v-list-item-avatar>

					<v-list-item-content>
						<v-list-item-title v-text="post.data.item.title" />
						<v-list-item-subtitle v-text="post.data.item.price" />
					</v-list-item-content>
					<v-progress-circular
						v-if="!post.guid"
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
