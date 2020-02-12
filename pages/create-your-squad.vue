<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" my-squad class="topBar" />
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
				<div class="invite-loop d-flex justify-space-around">
					<div>
						<div class="user-sec">
							<img :src="me && me.avatar" class="user-image">
						</div>
						<span class="user-name">You</span>
					</div>
					<div>
						<div class="user-sec">
							<v-icon>
								mdi-account-plus-outline
							</v-icon>
						</div>
					</div>
					<div>
						<div class="user-sec" />
					</div>
					<div>
						<div class="user-sec" />
					</div>
				</div>
				<v-btn ref="skip-btn" outlined depressed class="skip-btn" @click="skip">
					{{ $t('create_your_squad.skip_for_now') }}
				</v-btn>
			</div>
			<v-dialog v-model="showShare">
				<ShareProfile ref="share-profile-modal" :user-link="userLink" />
			</v-dialog>
		</v-layout>
	</v-container>
</template>

<style lang="stylus"></style>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import { UserStore } from '~/store/user';
import TopBar from '~/components/common/TopBar.vue';
import ShareProfile from '~/components/UserProfile/ShareProfile';
import { DEFAULT_LANDING } from '~/store/squad';

const CANCALED_BY_USER = 20;

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		TopBar,
		ShareProfile,
	},
	asyncData({ store, redirect }) {
		const { me } = store.state.user;
		if (!me.guid) {
			return;
		}
		if (!me.nameSelected) {
			redirect('/select-username');
		} else if (me.squaddersCount) {
			redirect(DEFAULT_LANDING);
		}
	},
	data: () => ({
		showShare: false,
	}),
	computed: {
		...userState([
			'me',
		]),
		...mapState([
			'socket',
		]),
		target () {
			const { siteUrl, siteTitle } = this.$store.state.merchant;
			return {
				id: this.me.userId,
				url: siteUrl,
				title: siteTitle,
				invite: true,
			};
		},
		userLink () {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			return `${API_ENDPOINT}/community/profile?t=${btoa(target)}`;
		},
	},
	methods: {
		async share () {
			this.showShare = false;
			if (navigator && navigator.share) {
				const { siteTitle } = this.$store.state.merchant;
				const title = `${this.me.name} @ ${siteTitle}`;
				try {
					await navigator.share({
						title,
						text: title,
						url: this.userLink,
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
	},
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
			img
				width 100%
				height 100%
				border-radius 50%
			span.user-name
				font-weight 700
				display block
				margin-top 0px
				font-size 3.69vw
				text-align center
.skip-btn
	border-radius 10px
	position fixed
	bottom 90px
	right 24px
	font-size 12px
</style>
