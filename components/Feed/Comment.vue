<template>
	<v-list-item>
		<v-list-item-avatar size="36">
			<v-img :src="comment.author.avatar" />
		</v-list-item-avatar>

		<v-list-item-content>
			<v-list-item-title v-text="comment.author.name || comment.author.screenName" />
			<v-list-item-subtitle v-text="comment.text" />
		</v-list-item-content>
	</v-list-item>
</template>

<script lang="js">

export default {
	name: 'Comment',
	props: {
		comment: {
			type: Object,
			required: true,
		},
	},
};
</script>
