<template>
	<nuxt-link ref="user-link" :to="getUserLink()">
		<v-list-item v-if="!hideAvatar">
			<v-list-item-avatar :size="size">
				<img :src="user && user.avatar" :alt="user && user.screenName">
			</v-list-item-avatar>
			<v-list-item-content v-if="!hideName">
				<v-list-item-title>
					{{ user.screenName }}
				</v-list-item-title>
				<v-list-item-subtitle>
					{{ timeString }}
				</v-list-item-subtitle>
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
		ts: {
			type: Number,
			default: 0,
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
		timeString () {
			window.moment.locale(this._i18n.locale);
			return this.ts && window.moment(this.ts).fromNow();
		},
	},
	methods: {
		getUserLink() {
			return (this.user.guid === this.me.userId ? { name: 'me' }
				: { name: 'user-id', params: { id: this.user.guid } }
			);
		},
	},
};
</script>
