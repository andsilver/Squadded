<template>
	<nuxt-link :to="link">
		<v-list-item>
			<v-list-item-avatar>
				<img :src="user && user.avatar" :alt="user && user.screenName">
			</v-list-item-avatar>
			<v-list-item-content>
				<v-list-item-title class="headline">
					{{ user.screenName }}
				</v-list-item-title>
			</v-list-item-content>
		</v-list-item>
	</nuxt-link>
</template>

<script>
export default {
	name: 'UserLink',
	props: {
		link: {
			type: Object,
			required: true,
		},
		user: {
			type: Object,
			required: true,
		},
	},
};
</script>
