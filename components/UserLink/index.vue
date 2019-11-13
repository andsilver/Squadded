<template>
	<nuxt-link ref="user-link" :to="getUserLink()">
		<v-list-item v-if="!hideAvatar" class="pa-0 user_link_header">
			<v-list-item-avatar class="mr-3" :size="size">
				<img :src="user && user.avatar" :alt="user && user.screenName">
			</v-list-item-avatar>
			<v-list-item-content v-if="!hideName">
				<v-list-item-title class="user_name">
					{{ user.name || user.screenName }}
				</v-list-item-title>
				<v-list-item-subtitle v-if="ts" class="user_timestamp">
					{{ timeString }}
				</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>
		<span v-else>
			{{ user.name || user.screenName }}
		</span>
	</nuxt-link>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { UserStore } from '~/store/user';

const { mapState } = createNamespacedHelpers(UserStore);

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
			const isNewPost = this.ts === Number.MAX_SAFE_INTEGER;
			return isNewPost ? this.$t('post.sending') : this.ts && window.moment(this.ts).fromNow();
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

<style scoped>
	.user_name {
		font-size: .8em;
		font-weight: 600;
	}

	.user_timestamp {
		font-size: .7em;
		font-weight: 400;
	}

	.user_link_header {
		position: relative;
	}
</style>
