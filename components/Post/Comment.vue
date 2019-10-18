<template>
	<v-list-item>
		<UserLink size="36" :user="comment.author" hideName />
		<v-list-item-content>
			<UserLink :user="comment.author" hideAvatar />
			<v-list-item-subtitle v-text="comment.text" />
		</v-list-item-content>
	</v-list-item>
</template>

<script lang="js">
import UserLink from '~/components/UserLink';

export default {
	name: 'Comment',
	components: {
		UserLink,
	},
	props: {
		comment: {
			type: Object,
			required: true,
		},
	},
};
</script>
