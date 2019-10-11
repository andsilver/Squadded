<template>
	<v-layout v-if="user && user.name" flex-column>
		<v-toolbar dense flat>
			<v-btn icon @click="goBack">
				<v-icon>
					mdi-arrow-left
				</v-icon>
			</v-btn>
			<div class="flex-grow-1" />
			<v-btn icon>
				<v-icon>
					mdi-dots-vertical
				</v-icon>
			</v-btn>
		</v-toolbar>
		<v-list-item>
			<v-list-item-content align="center">
				<v-list-item-title class="headline">
					{{ user.name }}
				</v-list-item-title>
				<v-avatar size="100" class="my-3">
					<img :src="user.avatar" alt="">
				</v-avatar>
				<v-list-item-subtitle>{{ user.mention }}</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>
		<v-list-item align="center">
			<v-list-item-content>
				<v-list-item-title class="headline">
					{{ short(user.following) }}
				</v-list-item-title>
				<v-list-item-subtitle>{{ $t('user.Following') }}</v-list-item-subtitle>
			</v-list-item-content>
			<v-list-item-content>
				<v-list-item-title class="headline">
					{{ short(user.followers.count) }}
				</v-list-item-title>
				<v-list-item-subtitle>{{ $t('user.Followers') }}</v-list-item-subtitle>
			</v-list-item-content>
			<v-list-item-content>
				<v-list-item-title class="headline">
					{{ short(user.likes) }}
				</v-list-item-title>
				<v-list-item-subtitle>{{ $t('user.Likes') }}</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>
		<v-row justify="center" class="my-3">
			<v-btn>{{ user.followers.me ? $t('user.Unfollow') : $t('user.Follow') }}</v-btn>
		</v-row>
		<p align="center">
			{{ user.bio }}
		</p>
		<v-tabs centered>
			<v-tab>
				<v-icon size="32">
					mdi-chevron-triple-down
				</v-icon>
			</v-tab>
			<v-divider
				class="mx-4"
				inset
				vertical
			/>
			<v-tab>
				<v-icon size="32">
					mdi-heart-multiple-outline
				</v-icon>
			</v-tab>
		</v-tabs>
	</v-layout>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { UserStore, UserMutations } from '~/store/user';
import { shortNumber, onStoreMutation } from '~/helpers';

const { mapState } = createNamespacedHelpers('user');

export async function fetch(guid, store) {
	if (!store.state.socket.$ws) {
		await onStoreMutation(store, 'SET_SOCKET_AUTH', true);
	}
	store.state.socket.$ws.sendObj({ type: 'fetchUser', guid });
	return onStoreMutation(store, `${UserStore}/${UserMutations.setOther}`)
		.then(() => store.state.user.other);
}

export default {
	data: () => ({
		userId: null,
		other: null,
	}),
	computed: {
		...mapState([
			'me',
		]),
		user () {
			return this.userId ? this.other : this.me;
		},
	},
	asyncData ({ store, query }) {
		if (!query.id) {
			return;
		}
		return fetch(query.id, store).then(user => ({ other: user }));
	},
	created() {
		this.userId = this.$route.query.id;
	},
	methods: {
		goBack() {
			history.back();
		},
		short(number) {
			return shortNumber(number, this._i18n.locale);
		},
	},
};
</script>
