<template>
	<v-container v-if="user && user.name">
		<section class="fixed_profile" :class="{ slide: isScrolled }">
			<v-avatar
				class="user_avatar"
				width="40px"
				height="40px"
				min-width="none"
			>
				<v-img
					:key="user.avatar"
					:src="user.avatar"
				/>
			</v-avatar>
			<section class="user_info_fixed">
				<userName class="user_fixed_name" :name="user.name" />
				<userStatistics :user="user" :scrolled="true" />
			</section>
			<Follow :user="user" />
		</section>
		<section class="profile_background_image">
			<section class="background_shadow" />
			<v-img height="40.46vw" :src="require('~/assets/img/profile-cover-picture.svg')" />
		</section>
		<ProfileToolbar :user="user" />
		<v-layout flex-column>
			<v-list-item class="px-0 user_info">
				<v-list-item-content align="center" class="py-1">
					<userAvatar align="center" class="user_avatar my-0" :avatar="user.avatar" />
					<userName :name="user.name" />
					<p align="center" class="user-biodata">
						{{ user.bio }}
					</p>
					<userMention class="mt-0 caption mention" :mention="user.mention ? user.mention : ''" />
				</v-list-item-content>
			</v-list-item>
			<div v-if="user.isMe" class="edit-button-sec">
				<span><img src="~assets/img/profile-Instagram.svg" class="insta-image"></span>
				<Button class="edit-button" @click.native="edit">
					{{ $t('user.edit') }}
				</Button>
			</div>
			<div v-if="!user.isMe" class="follow-button-sec  has-notification">
				<span class="insta-image-sec image-section"><img src="~assets/img/profile-Instagram.svg" class="insta-image"></span>
				<Follow ref="follow-btn" :user="user" class="follow" />
				<span v-if="show_notification" class="notification-image-sec image-section" @click="toggleNotification"><img src="~assets/img/user-notifications-icon.svg" class="notification-image"></span>
				<span v-if="!show_notification" class="notification-image-sec image-section" @click="toggleNotification"><img src="~assets/img/user-block-notifications.svg" class="notification-image"></span>
				<Actions :user="user" class="popup-menu" />
			</div>
			<userStatistics :user="user" />
			<Invitation v-if="invite" ref="invitation" :user="user" />
			<v-tabs
				v-model="tabs"
				class="px-1"
				fixed-tabs
				centered
				@change="keepTab"
			>
				<v-tab class="tabs pt-3">
					<span style="text-transform: capitalize;">{{ $t('Posts') }}</span>
				</v-tab>
				<v-tab class="tabs pt-3">
					<span style="text-transform: capitalize">{{ $t('Wishlist') }}</span>
				</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tabs">
				<v-tab-item class="mt-3">
					<Blog />
				</v-tab-item>
				<v-tab-item>
					<Whishlist />
				</v-tab-item>
			</v-tabs-items>
		</v-layout>
		<NotSignedInDialog ref="not-signed-in-dialog" :user="user" :show="!me" />
	</v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import ProfileToolbar from './ProfileToolbar';
import userAvatar from './userAvatar';
import userName from './userName';
import userMention from './userMention';
import userStatistics from './userStatistics';
import Invitation from './Invitation';
import Actions from './Actions';
import Follow from '~/components/common/Follow';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';
import Blog from '~/components/Blog';
import Whishlist from '~/components/Whishlist';
import NotSignedInDialog from '~/components/LandingPost/NotSignedInDialog';
import Button from '~/components/common/Button';

const { mapState } = createNamespacedHelpers(UserStore);

export default {
	name: 'User',
	components: {
		Follow,
		userAvatar,
		userName,
		userMention,
		userStatistics,
		Invitation,
		ProfileToolbar,
		Blog,
		Whishlist,
		NotSignedInDialog,
		Button,
		Actions,
	},
	asyncData ({ store, params, redirect, query }) {
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
	data: () => ({
		other: null,
		userId: null,
		tabs: 0,
		isScrolled: false,
		invite: false,
		show_notification: false,
	}),
	computed: {
		...mapState([
			'me',
		]),
		user () {
			return this.userId ? this.other : this.me;
		},
	},
	created () {
		if (this.$route.hash === '#wishlist') {
			this.tabs = 1;
		}
		if (this.$route.hash === '#follow') {
			this.promptFollow();
		}
	},
	mounted () {
		this.userId = this.$route.params.id;
		this.invite = this.$route.query ? this.$route.query.invite : false;
		this.bindScroll();
	},
	methods: {
		bindScroll () {
			window.addEventListener('scroll', this.scrolled.bind(this));
		},
		keepTab () {
			this.$router.push({ hash: this.tabs ? 'wishlist' : '' });
		},
		scrolled (e) {
			// TODO calc actual height to tabs instead const
			this.isScrolled = !!(window.scrollY > 350);
		},
		async promptFollow () {
			await this.user;
			this.$root.$emit('prompt', {
				text: { question: this.$t('user.promptFollow', [this.user.name]) },
				confirm: () => {
					this.$refs['follow-btn'].toggleFollow(true);
				},
			});
		},
		edit () {
			this.$router.push('/profile-settings');
		},
		toggleNotification () {
			this.show_notification = !this.show_notification;
		},
	},
};
</script>

<style scoped>
	.mention {
		color: rgba(0,0,0,.54);
	}

	.v-btn.follow {
		height: 9.23vw;
		margin: 0;
	}

	.tabs {
		padding-bottom: 6%;
		border-bottom: 2px solid rgba(0,0,0,.1);
		font-size: 4.30vw;
		font-weight: 500;
		color: #B8B8BA;
		font-weight: 600;
	}

	.user_avatar {
		left: 0;
	}

	.user_info {
		background-color: transparent;
		margin-top: 5.5vh;
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
		position: fixed;
		top: -70px;
		left: 0;
		width: 100%;
		z-index: 10;
		border-bottom: 1px solid rgba(112, 112, 112, .3);
		background-color: #fff;
		padding: 3%;
		transition-property: top;
		transition-duration: .1s;
	}

	.fixed_profile.slide {
		top: 0;
	}

	.fixed_profile .user_avatar {
		margin-right: 4%;
	}

	.user_fixed_name {
		font-size: .8em;
	}

	.user_info_fixed {
		flex-grow: 1;
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
	.user-biodata {
		margin-top: 4.46vw;
		font-size: 4.30vw;
		color: #000000;
	}
	.edit-button-sec {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 6.24vw 0;
	}
	.edit-button-sec span{
		display: flex;
	}
	img.insta-image {
		width: 6.76vw;
		margin-right: 6.29vw;
	}
	img.notification-image {
		width: 5.53vw;
		margin-left: 6.29vw;
	}
	.follow-button-sec{
		margin: 6.24vw 0;
		display: grid;
		grid-template-columns: 1fr 13.05vw 1fr 1fr;
		position: relative;
	}
	.follow-button-sec.has-notification{
		grid-template-columns: 1fr 13.05vw 1fr 11.82vw 1fr;
	}
	.follow-button-sec span {
		display: flex;
	}
	.insta-image-sec.image-section{
		grid-column-start: 2;
	}
	button.edit-button.v-btn.v-btn--depressed.v-btn--rounded.theme--dark.v-size--default {
		height: 9.23vw;
		width: 26.92vw;
		font-size: 2.15vw;
		font-weight: 700;
		line-height: 4.30vw;
		letter-spacing: 1.5px;
		margin: 0;
	}
	.popup-menu {
		display: flex;
		align-self: center;
		margin-left: auto;
	}
</style>
