<template>
	<v-container>
		<v-layout
			v-if="!socket.isPendingAuth"
			column
		>
			<div class="login">
				<div class="text-center my-2">
					<!--<span>{{ $t('getStarted') }}</span>-->
					<div class="brand-section">
						<div class="brand-title">
							{{ $t('ShopWithYourFriendsOn') }}
						</div>
						<img src="../assets/img/logo-dcm.svg" class="b-logo">
						<div class="poweredby">
							{{ $t('PoweredBy') }}
							<img src="../assets/img/squaddedcyrcleB_trim.svg" class="powerdby-image">
						</div>
					</div>
				</div>
				<div class="pick-username-sec">
					<h4>
						{{ $t('PickUsername') }}
					</h4>
					<span>{{ $t('StartBuildingYourSquad') }}</span>
				</div>
				<div class="select-user-icon-sec">
					<img src="../assets/img/select-user-icon.svg" class="select-user-icon">
					<span class="edit-icon-sec"><img src="../assets/img/action-edit.svg" class="edit-icon-image"></span>
				</div>
				<div class="username-form-sec">
					<v-text-field
						:label="$t('EnterUsername')"
						required
						solo
						flat
						dense
						class="username-field"
						hide-details
					/>
					<span class="comment-msg">{{ $t('YouCanAlwaysChange') }}</span>
					<v-btn
						class="full-width done-btn"
						color="primary"
						large
						depressed
					>
						{{ $t('form.done') }}
					</v-btn>
				</div>
			</div>
		</v-layout>
	</v-container>
</template>

<style lang="stylus">
.social
	display flex
	justify-content space-between
	margin-top 6.81vw
	span
		font-size 3.23vw
		font-weight 600
		text-transform capitalize
.brand-section
	background #F4F4F5
	padding 4.87vw 12.36vw 2.55vw 15.32vw
	border-radius 4vw
	.brand-title
		font-family: 'Montserrat', sans-serif
		font-weight: 600
		font-size: 4.61vw
		line-height: 3.66vw
		padding-bottom: 3.27vw
	img.b-logo
		width 23.38vw
		height 15.23vw
		margin-bottom 4.46vw
	.poweredby
		font-size 2.92vw
		font-weight 600
		display flex
		align-items center
		justify-content center
		img.powerdby-image
			width 22.76vw
			margin-left 1.23vw
.pick-username-sec
	text-align center
	margin 10vw auto 0
	width 90%
	h4
		font-size 4.30vw
		font-weight 700
	span
		font-size 3.69vw
		color #000
		line-height 4.92vw
		margin-top 5.38vw
		display: block
		font-weight 500
.select-user-icon-sec
	width 24.61vw
	height 24.61vw
	margin 0 auto
	display block
	position relative
	margin-top 9.46vw
	img.select-user-icon
		width 100%
		border-radius 50%
	span.edit-icon-sec
		position absolute
		bottom 0
		width 8.15vw
		height 8.15vw
		z-index 1
		background #fff
		display flex
		right 0
		align-items center
		justify-content center
		border-radius 50%
		box-shadow 0 0.92vw 6.15vw rgba(0,0,0,0.10)
		img.edit-icon-image
			width 4.38vw
			height 4.38vw
.username-form-sec
	padding 0 3.2vw
	margin-top 7.23vw
	.username-field
		border 0.30vw solid #DBDBDB
		border-radius 3.07vw
		height 10.76vw
		input, label
			font-size 3.69vw
			color #000000 !important
			width 100%
			text-align center
			margin-top 2px
		.v-input__control
			height 10.76vw !important
			min-height auto !important
		input
			font-weight 700
	.comment-msg
		color #B8B8BA
		text-align center
		display block
		margin 2.26vw auto 5.89vw
		font-size 3.38vw
		width 90%
	.done-btn
		width 43.84vw
		height 12.30vw !important
		border-radius 3.07vw
		margin 0 auto
		display block
		font-size 2.61vw !important
		letter-spacing 2px
		text-transform uppercase !important
		font-weight 700
</style>

<script>
import { mapState } from 'vuex';
import { DEFAULT_LANDING } from '~/store/squad';

export default {
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
