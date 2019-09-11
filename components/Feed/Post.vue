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
		<span class="likes">
			<span v-if="post.likes" class="count">{{ post.likes }}</span>
			<v-icon color="red" size="30">mdi-heart</v-icon>
		</span>
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

<style lang="stylus" scoped>
.likes .count
	position absolute
	width 100%
	line-height 30px
	text-align center
	font-size 13px

.likes
	position relative
</style>
