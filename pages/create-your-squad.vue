<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout column class="create-your-squad">
			<div ref="create-squad-text" class="create-text-sec">
				<h2>
					Create your squad
				</h2>
				<span>Add your friends to join your squad. Once they join, you will be able to see and interact with each other’s wishlist.</span>
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
				<div class="invite-loop">
					<div class="user-sec">
						<img src="../assets/img/Avatar.png" class="user-image">
						<span class="user-name">You</span>
					</div>
					<div class="user-sec">
						<img src="../assets/img/Avatar.png" class="user-image">
					</div>
					<div class="user-sec">
						<img src="../assets/img/Avatar.png" class="user-image">
					</div>
					<div class="user-sec">
						<img src="../assets/img/Avatar.png" class="user-image">
					</div>
				</div>
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

const CANCALED_BY_USER = 20;

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		TopBar,
		ShareProfile,
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
			};
		},
		userLink () {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			return `${API_ENDPOINT}/community/invite?t=${btoa(target)}`;
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
			display flex
			.user-sec
				width 25%
				text-align center
				img.user-image
					width 80%
				span.user-name
					font-weight 700
					display block
					margin-top 0px
					font-size 3.69vw

</style>
