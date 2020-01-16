<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout column class="create-your-squad">
			<div class="create-text-sec">
				<h2>
					Create your squad
				</h2>
				<span>Add your friends to join your squad. Once they join, you will be able to see and interact with each other’s wishlist.</span>
			</div>
			<div class="invite-sec">
				<v-btn
					class="full-width invite-btn"
					color="primary"
					large
					depressed
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
		</v-layout>
	</v-container>
</template>

<style lang="stylus"></style>

<script>
import { mapState } from 'vuex';
import { DEFAULT_LANDING } from '~/store/squad';
import TopBar from '~/components/common/TopBar.vue';

export default {
	components: {
		TopBar,
	},
	asyncData ({ store, redirect }) {
		if (store.state.socket.isAuth) {
			redirect(DEFAULT_LANDING);
		}
	},
	computed: {
		...mapState([
			'socket',
		]),
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
