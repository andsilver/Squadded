<template>
	<v-container v-if="user && user.name">
		<section v-if="isScrolled" class="fixed_profile">
			<v-avatar class="user_avatar">
				<img :src="user.avatar">
			</v-avatar>
			<section class="user_info_fixed">
				<userName class="user_fixed_name" :name="user.name" />
				<userStatistics :user="user" :scrolled="isScrolled" />
			</section>
			<Button v-if="!user.isMe" class="fixed_follow_btn" @click.native="toggleFollow">
				<span>{{ user.followers.me ? $t('user.Unfollow') : $t('user.Follow') }}</span>
			</Button>
		</section>
		<section class="profile_background_image">
			<section class="background_shadow" />
			<v-img height="122" src="https://picsum.photos/id/699/600/300" />
		</section>
		<ProfileToolbar />
		<v-layout flex-column>
			<v-list-item class="px-0 user_info">
				<v-list-item-content align="center" class="py-1">
					<userAvatar align="center" class="user_avatar my-0" :avatar="user.avatar" />
					<userName class="mt-2" :name="user.name" />
					<userMention class="mt-0 caption mention" :mention="user.mention ? user.mention : 'Love my parents and they like me too'" />
				</v-list-item-content>
			</v-list-item>
			<userStatistics class="pt-0" :user="user" />
			<Button v-if="!user.isMe" ref="follow-btn" @click.native="toggleFollow">
				{{ user.followers.me ? $t('user.Unfollow') : $t('user.Follow') }}
			</Button>
			<p align="center">
				{{ user.bio }}
			</p>
			<v-tabs
				v-model="tabs"
				class="px-1"
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
import ProfileToolbar from '../common/ProfileToolbar';
import userAvatar from './userAvatar';
import userName from './userName';
import userMention from './userMention';
import userStatistics from './userStatistics';
import Button from '~/components/common/Button';
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';
import Blog from '~/components/Blog';
import Whishlist from '~/components/Whishlist';

const { mapState } = createNamespacedHelpers(UserStore);

export default {
	name: 'User',
	components: {
		Button,
		userAvatar,
		userName,
		userMention,
		userStatistics,
		ProfileToolbar,
		Blog,
		Whishlist,
	},
	data: () => ({
		other: null,
		userId: null,
		tabs: null,
		isScrolled: false,
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
	mounted () {
		this.userId = this.$route.params.id;
		setTimeout(() => {
			this.$el.closest('.v-content__wrap').addEventListener('scroll', this.scrolled.bind(this));
		}, 20);
	},
	methods: {
		toggleFollow () {
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
		scrolled (e) {
			// TODO calc actual height to tabs instead const
			this.isScrolled = !!(e.target.scrollTop > 300);
		},
	},
};
</script>

<style scoped>
	.mention {
		color: rgba(0,0,0,.54);
	}

	.tabs {
		padding-bottom: 6%;
		border-bottom: 2px solid rgba(0,0,0,.1);
		font-size: 1em;
		font-weight: 500;
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
	.background_shadow {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0) 75%);
	}

	.fixed_profile {
		display: flex;
		flex-direction: row;
		position: sticky;
		top: 0;
		z-index: 1000;
		border-bottom: 1px solid rgba(112, 112, 112, .3);
		background-color: #fff;
		padding-top: 3%;
	}

	.fixed_profile .user_avatar {
		margin-right: 4%;
	}

	.user_fixed_name {
		font-size: .8em;
	}

	.user_info_fixed {
		width: 50%;
		padding-top: 1.5%;
	}

	.fixed_follow_btn {
		width: 30%;
		margin-top: 1.5%;
		height: 35px;
		padding: 0;
		margin-left: auto;
	}

	.fixed_follow_btn span {
		font-size: .75em;
	}
</style>
