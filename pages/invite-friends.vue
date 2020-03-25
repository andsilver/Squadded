<template>
	<div class="d-flex flex-column justify-space-between flex-grow-1">
		<div>
			<div class="white--text black py-4 d-flex justify-space-between align-center px-4">
				<span class="pa-3" />
				<span class="font-weight-bold">{{ $t('invite_your_friends.title') }}</span>
				<a class="skip-btn" @click="skip">{{ $t('skip') }}</a>
			</div>
			<div class="py-4">
				<div class="px-4 font-weight-medium d-flex align-center mt-4">
					<img src="~assets/img/action-share.svg" width="16px">
					<span class="ml-2">{{ $t('invite_your_friends.share') }}</span>
				</div>
				<div class="px-4 d-flex flex-column align-center mt-4">
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
					<Button class="mt-4 copy-btn" @click.native="copy">
						{{ $t('invite_your_friends.copy_link') }}
					</Button>
				</div>
				<div class="px-4 or-divider">
					<v-divider />
					<span>{{ $t('invite_your_friends.or') }}</span>
				</div>
				<div>
					<div class="px-4 font-weight-medium d-flex align-center">
						<v-icon color="black">
							mdi-magnify
						</v-icon>
						<span class="ml-2">{{ $t('invite_your_friends.add') }}</span>
					</div>
					<FindFriends @invited="invited = true" />
				</div>
			</div>
		</div>
		<div class="py-6 d-flex justify-center done-section">
			<Button class="done-btn" :disabled="!invited" @click.native="goToFeed">
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
.skip-btn {
	font-weight: 600;
	font-size: 14px;
	text-transform: capitalize;
	color: #b8b8ba !important;
	cursor: pointer;
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
	margin-top: 8vh;
	margin-bottom: 24px;

	span {
		text-transform: uppercase;
		font-weight: bold;
		position: absolute;
		left: calc(50% - 21px);
		top: -10px;
		background: #fff;
		padding: 0 10px;
		color: #b8b8ba;
	}
}

.done-section {
	border-top: 1px solid rgba(0, 0, 0, 0.12);

	.done-btn {
		width: 120px;
	}
}
</style>
