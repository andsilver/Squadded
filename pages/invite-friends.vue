<template>
	<div class="d-flex flex-column justify-space-between flex-grow-1">
		<div>
			<div class="white--text black py-4 d-flex justify-space-between align-center px-4">
				<span class="pa-3" />
				<span class="font-weight-bold invite-title">{{ $t('invite_your_friends.title') }}</span>
				<a class="skip-btn" @click="skip">{{ $t('skip') }}</a>
			</div>
			<div class="invite-middle">
				<div class="invite-share font-weight-medium d-flex align-center">
					<img src="~assets/img/action-share.svg">
					<span class="share-text">{{ $t('invite_your_friends.share') }}</span>
				</div>
				<div class="invite-share-input d-flex flex-column align-center">
					<v-text-field
						ref="link-field"
						v-model="link"
						readonly
						solo
						flat
						dense
						class="link-field"
						hide-details
					/>
					<Button class="copy-btn pa-0" style="width:46.92vw; height: 12.30vw; font-size: 2.61vw; letter-spacing: 2px; font-weight: 700;" @click.native="copy">
						{{ $t('invite_your_friends.copy_link') }}
					</Button>
				</div>
				<div class="or-divider">
					<v-divider />
					<span>{{ $t('invite_your_friends.or') }}</span>
				</div>
				<div>
					<div class="friend-title font-weight-medium d-flex align-center">
						<img src="~assets/img/search-Icon-frined.svg">
						<span class="title-lbl">{{ $t('invite_your_friends.add') }}</span>
					</div>
					<FindFriends class="signin-process" @invited="invited = true" />
				</div>
			</div>
		</div>
		<div class="py-6 d-flex justify-center done-section">
			<Button class="done-btn" style="width:36.92vw;height: 12.30vw;background-color: #000 !important; color: #ffffff !important;font-size: 2.61vw; letter-spacing: 2px;" :disabled="!invited" @click.native="goToFeed">
				{{ $t('done') }}
			</Button>
		</div>
	</div>
</template>

<script>
import { mapState, createNamespacedHelpers } from 'vuex';
import { UserStore } from '~/store/user';
import { FeedStore, FeedMutations } from '~/store/feed';
import { DEFAULT_LANDING } from '~/store/squad';
import { getShortURL } from '~/services/short-url';
import Button from '~/components/common/Button';
import FindFriends from '~/components/common/FindFriends';
import { copy } from '~/utils/copy';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		Button,
		FindFriends,
	},
	asyncData({ store, redirect }) {
		const { me } = store.state.user;
		if (!me.nameSelected) {
			redirect('/select-username');
		} else if (me.squaddersCount) {
			redirect(DEFAULT_LANDING);
		}
	},
	data: () => ({
		link: null,
		invited: false,
	}),
	computed: {
		...mapState(['socket']),
		...userState(['me']),
		target() {
			const { siteUrl, siteTitle } = this.$store.state.merchant;
			return {
				id: this.me.userId,
				url: siteUrl,
				title: siteTitle,
			};
		},
		userLink() {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			return `${API_ENDPOINT}/community/profile?t=${btoa(target)}`;
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
		},
		goToFeed() {
			this.$router.push(DEFAULT_LANDING);
		},
	},
};
</script>

<style lang="scss" scoped>
.invite-middle {
    margin-top: 10.52vw;
}
.invite-share {
    margin-left: 6.23vw;
}
.invite-share img {
    width: 4.76vw;
	margin-right: 2.92vw;
}
.copy-btn {
    margin-top: 4.26vw;
}
.invite-share-input {
    margin-top: 4.30vw;
	padding: 0 5VW;
}
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
.link-field {
	border: 1px solid #dbdbdb;
	border-radius: 10px;
	width: 100%;
	input,
	label {
		font-size: 3.69vw;
		color: #000000 !important;
		text-align: center;
		margin-top: 2px;
	}
	.v-input__control {
		height: 10.76vw !important;
		min-height: auto !important;
	}
	input {
		font-weight: 500;
	}
}

.copy-btn {
	background-color: #fd6256 !important;
	color: white;
	width: 160px;
}
.or-divider {
	position: relative;
	margin-top: 18vw;
	margin-bottom: 8vw;
	padding: 0 5VW;

	span {
		text-transform: uppercase;
		font-weight: bold;
		position: absolute;
		left: calc(50% - 8.76vw);
		top: -10px;
		background: #fff;
		padding: 0 22px;
		color: #b8b8ba;
		font-weight: 600;
		font-size: 4.30vw;
	}
}

.done-section {
	border-top: 1px solid rgba(0, 0, 0, 0.12);

	.done-btn {
		width: 120px;
	}
}
</style>
