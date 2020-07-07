<template>
	<div class="d-flex flex-column justify-space-between flex-grow-1">
		<div>
			<div class="white--text black py-4 d-flex justify-space-between align-center px-4">
				<span class="pa-3" />
				<span class="font-weight-bold invite-title">{{ $t('invite_your_friends.title') }}</span>
				<a class="skip-btn" @click="skip">{{ $t('skip') }}</a>
			</div>
			<div class="d-flex justify-center mt-4">
				<img class="invite-friends-img" src="~assets/img/invite-friends_img.png">
			</div>
			<div class="text-center mt-3">
				{{ $t('invite_your_friends.share') }}
			</div>
			<ShareInviteLink class="py-8 px-2" @shared="invited = true" />
			<div>
				<div class="friend-title font-weight-medium text-center">
					<span class="title-lbl">{{ $t('invite_your_friends.add') }}</span>
				</div>
				<FindFriends class="signin-process" show-facebook-friends @invited="invited = true" />
			</div>
		</div>
		<div class="py-4 d-flex justify-center done-section">
			<Button class="done-btn" :disabled="!invited" @click.native="goToFeed">
				{{ $t('done') }}
			</Button>
		</div>
	</div>
</template>

<script>
import { mapState, createNamespacedHelpers } from 'vuex';
import { Base64 } from 'js-base64';
import { UserStore } from '~/store/user';
import { FeedStore, FeedMutations } from '~/store/feed';
import { DEFAULT_LANDING } from '~/store/squad';
import { getShortURL } from '~/services/short-url';
import Button from '~/components/common/Button';
import FindFriends from '~/components/common/FindFriends';
import ShareInviteLink from '~/components/common/ShareInviteLink';
import { copy } from '~/utils/copy';
import { VISITED_INVITE_FRIENDS_KEY } from '~/consts/keys';
import { setLocalStorageItem } from '~/utils/local-storage';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		Button,
		FindFriends,
		ShareInviteLink,
	},
	asyncData({ store, redirect }) {
		const { me } = store.state.user;
		if (!me.nameSelected) {
			redirect('/select-username');
		} else if (me.squaddersCount || localStorage.getItem(VISITED_INVITE_FRIENDS_KEY)) {
			redirect(DEFAULT_LANDING);
		}
	},
	data: () => ({
		link: null,
		invited: false,
		copied: false,
	}),
	computed: {
		...mapState(['socket']),
		...userState(['me']),
		target() {
			const { siteUrl, siteTitle, native } = this.$store.state.merchant;
			return {
				id: this.me.userId,
				url: siteUrl,
				title: siteTitle,
				native,
			};
		},
		userLink() {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			return `${API_ENDPOINT}/community/profile?t=${Base64.encode(target)}`;
		},
	},
	watch: {
		me(value) {
			if (value.squaddersCount) {
				this.$store.commit(`${FeedStore}/${FeedMutations.clear}`);
				this.$router.push(DEFAULT_LANDING);
			}
		},
	},
	mounted() {
		setLocalStorageItem(VISITED_INVITE_FRIENDS_KEY, Date.now().toString());
		this.setLink();
	},
	methods: {
		async setLink() {
			this.link = await getShortURL(this.userLink, this.$store);
		},
		skip() {
			this.$router.push(DEFAULT_LANDING);
		},
		copy() {
			this.$refs['link-field'].$el.querySelector('input').select();
			copy();
			this.invited = true;
			this.copied = true;
			setTimeout(() => (this.copied = false), 1000);
		},
		goToFeed() {
			this.$router.push(DEFAULT_LANDING);
		},
	},
};
</script>

<style lang="scss" scoped>
.friend-title {
	padding: 0 5VW;
}
.friend-title img{
	width: 5.44vw;
}
.friend-title .title-lbl{
	margin-left: 2.15vw;
	font-weight: 600;
	font-size: 4.30vw;
}
.skip-btn {
	font-weight: 700;
	font-size: 4.30vw;
	text-transform: capitalize;
	color: #b8b8ba !important;
	cursor: pointer;
}
.invite-title {
	font-weight: 700;
	font-size: 4.30vw;
}
.share-text {
	font-weight: 600;
	font-size: 4.30vw;
}
.done-section {
	border-top: 1px solid rgba(0, 0, 0, 0.12);

	.done-btn {
		width:36.92vw;
		height: 12.30vw;
		color: #ffffff !important;
		font-size: 2.61vw;
		letter-spacing: 2px;
	}
}
.invite-friends-img {
	width: 90vw;
	object-fit: contain;
}
</style>
