<template>
	<v-layout v-if="user && user.name" flex-column>
		<userToolbar v-if="!scrolled" class="user_toolbar" />
		<v-list-item class="px-0">
			<v-list-item-content align="center">
				<userAvatar :align="scrolled === true ? 'left' : 'center' " class="user_avatar my-0" :user="user" />
				<userName class="mt-3" :name="user.name" />
				<userMention v-if="!scrolled" class="mt-1 caption mention" :mention="user.mention ? user.mention : 'Love my parents and they like me too'" />
			</v-list-item-content>
		</v-list-item>
		<userStatistics class="pt-0" :user="user" />
		<Button v-if="me.userId !== user.userId" ref="follow-btn" @click="toggleFollow">
			{{ user.followers.me ? $t('user.Unfollow') : $t('user.Follow') }}
		</Button>
		<p align="center">
			{{ user.bio }}
		</p>
		<v-tabs
			v-model="tabs"
			fixed-tabs
			centered
		>
			<v-tab class="tabs pt-3">
				<span style="text-transform: capitalize;">Activities</span>
			</v-tab>
			<v-tab class="tabs pt-3">
				<span style="text-transform: capitalize">Wishlist</span>
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="tabs">
			<v-tab-item>
				<Blog />
			</v-tab-item>
			<v-tab-item>
				<Whishlist />
			</v-tab-item>
		</v-tabs-items>
	</v-layout>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import userAvatar from './userAvatar';
import userName from './userName';
import userMention from './userMention';
import userStatistics from './userStatistics';
import userToolbar from './userToolbar';
import Button from '~/components/common/Button';
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';
import Blog from '~/components/Blog';
import Whishlist from '~/components/Whishlist';

const { mapState } = createNamespacedHelpers('user');

export default {
	name: 'User',
	components: {
		Button,
		userAvatar,
		userName,
		userMention,
		userStatistics,
		userToolbar,
		Blog,
		Whishlist,
	},
	data: () => ({
		other: null,
		userId: null,
		tabs: null,
		scrolled: false,
	}),
	computed: {
		...mapState([
			'me',
		]),
		user () {
			return this.userId ? this.other : this.me;
		},
	},
	asyncData ({ store, params, redirect }) {
		if (!params.id) {
			return;
		}
		if (params.id === store.state.user.me.userId) {
			redirect('/me');
		}
		return prefetch({
			guid: params.id,
			mutation: `${UserStore}/${UserMutations.setOther}`,
			store,
			type: 'fetchUser',
		}).then(() => ({ other: store.state.user.other }));
	},
	created() {
		this.userId = this.$route.params.id;
	},
	mounted() {
		if (this.$store.state.socket.isAuth) {
			this.$store.commit('SET_PENDING', false);
		}
	},
	methods: {
		goBack() {
			history.back();
		},
		toggleFollow() {
			const { other } = this;
			if (!other) {
				return;
			}
			const follow = !other.followers.me;
			this.$ws.sendObj({
				type: 'follow',
				guid: other.userId,
				follow,
			});
			this.$store.commit(`${FeedStore}/${FeedMutations.clear}`);
			this.$store.commit(`${UserStore}/${UserMutations.setFollow}`, { follow, other });
			this.$store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
			this.$forceUpdate();
		},
	},
};
</script>

<style scoped>
	.user_toolbar {
		background-color: transparent;
	}

	.mention {
		color: rgba(0,0,0,.54);
	}

	.tabs {
		border-bottom: 2px solid rgba(0,0,0,.1);
		font-size: 1em;
	}

	.user_avatar {
		left: 0;
	}

</style>
