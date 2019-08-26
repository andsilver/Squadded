<template>
	<v-list-item>
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

<script lang="js">
export default {
	name: 'FeedPost',
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
};
</script>
