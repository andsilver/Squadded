<template>
	<v-container v-if="user && user.name">
		<section class="profile_background_image">
			<v-img height="122" src="https://picsum.photos/id/699/600/300" />
		</section>
		<userToolbar class="user_toolbar" />
		<v-layout flex-column>
			<v-list-item class="px-0 user_info">
				<v-list-item-content align="center">
					<userAvatar align="center" class="user_avatar my-0" :user="user" />
					<userName class="mt-2" :name="user.name" />
					<userMention class="mt-0 caption mention" :mention="user.mention ? user.mention : 'Love my parents and they like me too'" />
				</v-list-item-content>
			</v-list-item>
			<userStatistics class="pt-0" :user="user" />
			<Button v-if="me.userId !== user.userId" ref="follow-btn" @click.native="toggleFollow">
				{{ user.followers.me ? $t('user.Unfollow') : $t('user.Follow') }}
			</Button>
			<p align="center">
				{{ user.bio }}
			</p>
			<v-tabs
				v-model="tabs"
				class="px-5"
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
	</v-container>
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
		padding-bottom: 6%;
		border-bottom: 2px solid rgba(0,0,0,.1);
		font-size: 1em;
		font-weight: 600;
		opacity: .9;
		color: #B8B8BA;
	}

	.user_avatar {
		left: 0;
	}

	.user_info {
		background-color: transparent;
		margin-top: 3%;
	}

	.v-tab--active {
		color: black;
		background-color: white;
	}

	.v-tab--active:before {
		background-color: white;
	}

	.profile_background_image {
		position: absolute;
		width: 100%;
		left: 0;
		top: 0;
	}
</style>
