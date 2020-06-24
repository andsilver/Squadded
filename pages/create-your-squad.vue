<template>
	<v-container v-if="socket.isAuth && me.guid" class="layout-padding">
		<!-- <TopBar ref="top-bar" my-squad class="topBar" /> -->
		<v-layout column class="create-your-squad">
			<div ref="create-squad-text" class="create-text-sec">
				<h2>
					{{ $t('create_your_squad.title') }}
				</h2>
				<span>
					{{ $t('create_your_squad.description') }}
				</span>
			</div>
			<div class="invite-sec">
				<v-btn
					ref="invite-btn"
					class="full-width invite-btn"
					color="primary"
					large
					depressed
					@click="share"
				>
					{{ $t('Send invite Link') }}
				</v-btn>
				<div class="invite-loop d-flex justify-space-between">
					<div class="d-flex flex-column flex-grow-1 align-center">
						<div class="user-sec">
							<img :src="me && me.avatar" class="user-image">
						</div>
						<span class="user-name">You</span>
					</div>
					<div class="d-flex flex-column flex-grow-1 align-center">
						<template v-if="showInvite">
							<div class="user-sec invited">
								<img :src="other.avatar">
							</div>
							<span class="user-name">{{ other.name }}</span>
						</template>
						<div v-else class="user-sec">
							<img src="~assets/img/invite-user.svg" class="invite-user">
						</div>
					</div>
					<div class="d-flex flex-column flex-grow-1 align-center">
						<div v-if="showInvite" class="user-sec">
							<img src="~assets/img/invite-user.svg" class="invite-user">
						</div>
						<div v-else class="user-sec" />
					</div>
					<div class="d-flex flex-column flex-grow-1 align-center">
						<div class="user-sec" />
					</div>
				</div>
				<div v-if="showInvite">
					<div class="d-flex flex-column justify-center align-center invited-sec" :class="{ isPending }">
						<div v-if="isPending" ref="invite-text" class="invite-text text-center mt-4">
							{{ $t('user.invitation.pending_text', { user: other.name }) }}
						</div>
						<template v-else>
							<div style="font-weight: 700;">
								{{ $t('create_your_squad.invited_you') }}
							</div>
							<div>
								{{ $t('create_your_squad.invited_text', { user: other.name }) }}
							</div>
							<div ref="invite-actions" class="d-flex justify-center mt-2">
								<Button ref="accept-btn" class="ma-0 mr-1" @click.native="accept">
									<v-icon class="mt-1" x-small>
										sqdi-checkmark
									</v-icon>
									<span class="ml-2">{{ $t('user.invitation.accept') }}</span>
								</Button>
								<v-btn ref="deny-btn" outlined depressed class="deny-btn" @click="deny">
									{{ $t('user.invitation.deny') }}
								</v-btn>
							</div>
						</template>
					</div>
				</div>
				<v-btn
					v-if="!items || !items.length"
					ref="skip-btn"
					outlined
					depressed
					class="skip-btn"
					@click="skip"
				>
					{{ $t('create_your_squad.skip_for_now') }}
				</v-btn>
			</div>
			<div v-if="items && items.length">
				<div class="pt-6 pb-3">
					<v-divider />
				</div>
				<Feed
					ref="feed-layout"
					:items="items"
					@loadMore="fetchFeed"
				/>
			</div>
			<v-dialog v-model="showShare" content-class="share_box">
				<ShareProfile ref="share-profile-modal" :user-link="shortURL" @hideShowShare="hideShare" />
			</v-dialog>
		</v-layout>
	</v-container>
</template>

<style lang="stylus"></style>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import { Base64 } from 'js-base64';
import { UserStore, UserMutations } from '~/store/user';
// import TopBar from '~/components/common/TopBar.vue';
import ShareProfile from '~/components/UserProfile/ShareProfile';
import { DEFAULT_LANDING } from '~/store/squad';
import { FeedActions, FeedGetters, FeedStore, FeedMutations } from '~/store/feed';
import Feed from '~/components/Feed';
import { prefetch } from '~/helpers';
import Button from '~/components/common/Button';
import { getShortURL } from '~/services/short-url';

const CANCALED_BY_USER = 20;

const userState = createNamespacedHelpers(UserStore).mapState;
const feed = createNamespacedHelpers(FeedStore);
const feedGetters = feed.mapGetters;
const feedState = feed.mapState;

export default {
	components: {
		// TopBar,
		ShareProfile,
		Feed,
		Button,
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
		showShare: false,
		denied: false,
		shortURL: '',
	}),
	computed: {
		...userState([
			'me',
			'other',
		]),
		...mapState([
			'socket',
		]),
		...feedState([
			'loading',
		]),
		...feedGetters([
			FeedGetters.items,
		]),
		target () {
			const { siteUrl, siteTitle, native } = this.$store.state.merchant;
			return {
				id: this.me.userId,
				url: siteUrl,
				title: siteTitle,
				invite: true,
				native,
			};
		},
		userLink () {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			return `${API_ENDPOINT}/community/profile?t=${Base64.encode(target)}`;
		},
		isPending() {
			return this.other && this.other.squad && this.other.squad.pending;
		},
		showInvite() {
			return !!this.other && !this.denied;
		},
	},
	watch: {
		me (value) {
			if (value.squaddersCount) {
				this.$store.commit(`${FeedStore}/${FeedMutations.clear}`);
				this.$router.push(DEFAULT_LANDING);
			}
		},
	},
	created () {
		if (!this.items || !this.items.length) {
			this.fetchFeed(true);
		}
		if (this.items && this.items.length) {
			this.$store.commit(`${FeedStore}/${FeedMutations.setLoading}`, false);
		}
		if (this.me.origin === 'invitation' && !this.denied) {
			this.fetchInviteUser();
		}
		this.denied = !!localStorage.getItem('denided_signup_invite');
	},
	methods: {
		fetchFeed (loadNew = false) {
			this.$store.dispatch(`${FeedStore}/${FeedActions.fetch}`, loadNew);
		},
		async share () {
			this.showShare = false;
			if (!this.shortURL) {
				this.shortURL = await getShortURL(this.userLink, this.$store);
			}
			if (navigator && navigator.share) {
				const { siteTitle } = this.$store.state.merchant;
				const title = `${this.me.name} @ ${siteTitle}`;
				try {
					await navigator.share({
						title,
						text: title,
						url: this.shortURL,
					});
				} catch (error) {
					if (error.code !== CANCALED_BY_USER) {
						this.showModal();
					}
				}
			} else {
				this.showModal();
			}
		},
		showModal () {
			this.showShare = true;
			this.$forceUpdate();
		},
		skip () {
			this.$router.push('/all');
		},
		hideShare () {
			this.showShare = false;
		},
		fetchInviteUser() {
			prefetch({
				guid: this.me.originUserId,
				mutation: `${UserStore}/${UserMutations.setOther}`,
				store: this.$store,
				type: 'fetchUser',
			});
		},
		accept() {
			this.$ws.sendObj({
				type: 'acceptSquad',
				targetUserId: this.other.userId || this.other.guid,
			});
		},
		deny() {
			if (this.other.squad && this.other.squad.exists) {
				this.$ws.sendObj({
					type: 'removeSquadder',
					guid: this.other.userId,
				});
			} else {
				this.denied = true;
				localStorage.setItem('denided_signup_invite', this.other.userId);
			}
		},
	},
	head: () => ({
		title: 'Onboarding-Create your squad',
	}),
};
</script>
<style lang="stylus">
.container.layout-padding
	padding 40px 0 0 0
	.layout
		padding 12px
	.create-text-sec
		text-align center
		width 90%
		margin 14.15vw auto 0
		h2
			font-size 7.38vw
			font-weight 700
		span
			margin-top 6.15vw
			font-size 3.69vw
			display block
			color #000
			font-weight 500
			line-height 4.92vw
			text-shadow 0 0 black
	.invite-sec
		margin-top 6.15vw
		.invite-btn
			width 46.92vw
			height 12.30vw !important
			border-radius 3.07vw
			margin 0 auto 13.84vw
			display block
			font-size 2.61vw !important
			letter-spacing 2px
			text-transform uppercase !important
			font-weight 700
		.invite-loop
			.user-sec
				width 60px
				height 60px
				border-radius 50%
				background #ececec
				display flex
				justify-content center
				align-items center
				flex-direction column
				&.invited
					opacity .5
			img
				width 100%
				height 100%
				border-radius 50%
				&.invite-user
					width 24px
			span.user-name
				font-weight 700
				display block
				margin-top 0px
				font-size 3.69vw
				text-align center
	.invited-sec
		width 168px
		margin-left 38px
		font-weight 500
		font-size 12px
		text-align center
		&.isPending
			margin-left 38px
		button
			height 32px
			min-height 32px
		.deny-btn
			font-size 0.6em
			font-weight 700
			letter-spacing 1px
			border-radius 10px

.skip-btn
	border-radius 10px
	position fixed
	bottom 90px
	right 24px
	font-size 12px
</style>
