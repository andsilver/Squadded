<template>
	<v-list-item>
		<v-list-item-avatar>
			<v-img :src="post.item.img" />
		</v-list-item-avatar>

		<v-list-item-content>
			<v-list-item-title v-text="post.item.title" />
			<v-list-item-subtitle v-text="post.item.price" />
		</v-list-item-content>
		<v-progress-circular
			v-if="!post.guid && !post.error"
			:width="3"
			color="primary"
			indeterminate
		/>
		<v-tooltip
			v-if="post.error"
			left
		>
			<template v-slot:activator="{ on }">
				<v-icon
					color="red"
					dark
					v-on="on"
				>
					mdi-alert
				</v-icon>
			</template>
			<span>{{ post.error }}</span>
		</v-tooltip>
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
