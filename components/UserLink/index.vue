<template>
	<nuxt-link ref="user-link" :to="getUserLink()">
		<v-list-item v-if="!hideAvatar">
			<v-list-item-avatar :size="size">
				<img :src="user && user.avatar" :alt="user && user.screenName">
			</v-list-item-avatar>
			<v-list-item-content v-if="!hideName">
				<v-list-item-title class="headline">
					{{ user.screenName }}
				</v-list-item-title>
			</v-list-item-content>
		</v-list-item>
		<v-list-item-title v-else>
			{{ user.screenName }}
		</v-list-item-title>
	</nuxt-link>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState } = createNamespacedHelpers('user');

export default {
	name: 'UserLink',
	props: {
		hideAvatar: {
			type: Boolean,
			default: false,
		},
		hideName: {
			type: Boolean,
			default: false,
		},
		size: {
			type: String,
			default: '40',
		},
		user: {
			type: Object,
			required: true,
		},
	},
	computed: {
		...mapState([
			'me',
		]),
	},
	methods: {
		getUserLink() {
			return (this.user.guid === this.me.userId ? { name: 'me' }
				: { name: 'user', query: { id: this.user.guid } }
			);
		},
	},
};
</script>
