<template>
	<div v-if="!isWishlistHasItems" class="empty_wishlist_container">
		<div class="whislist_empty">
			<div class="whish_img">
				<p>
					<img src="~assets/img/squad-logo-white.svg" class="insta-image">
				</p>
			</div>
			<div class="txt">
				<p ref="empty-whishlist-text" align="center">
					{{ $t('wishlist.postempty') }}
				</p>
				<Button class="flex-grow-1 wish_btn" @click.native="discoverItem">
					{{ $t('wishlist.discover') }}
				</Button>
			</div>
		</div>
	</div>
</template>

<script>
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
	},
	computed: {
		isWishlistHasItems () {
			const { wishlist } = this.$store.state.activity;
			return wishlist && wishlist.length;
		},
	},
	methods: {
		discoverItem() {
			this.$router.push('/explore');
		},
	},
};
</script>

<style lang="stylus" scoped>
.empty_wishlist_container
	position fixed
	width 100%
	height calc(100vh - 90px)
	background-color white
	bottom 0
	left 0
	z-index 202
.whislist_empty
	width 82.15vw
	margin 0 auto 0
	position absolute
	top 50%
	left 50%
	transform translate(-50%, -50%)
	.whish_img
		width 53.53vw
		height 24.61vw
		background #F5F5F5
		margin 0 auto
		position relative
		&:after
			content ''
			width 15.38vw
			height 15.38vw
			position absolute
			background #B8B8BA
			border-radius 50%
			right -0.5vw
			top -0.5vw
			z-index 0
		&:before
			content ''
			width 23.07vw
			height 23.07vw
			position absolute
			background #DBDBDB
			border-radius 50%
			right -4.3vw
			top -4.3vw
			z-index 0
		p
			position absolute
			right 1.8vw
			top 1.8vw
			background #000000
			border-radius 50%
			width 10.76vw
			height 10.76vw
			display flex
			justify-content center
			align-items center
			margin 0
			z-index 1
		img
			width 6.15vw
			height 4.66vw
	.txt
		p
			font-size 3.69vw
			font-weight 500
			color #000
			width 90%
			margin 6.87vw auto
		.wish_btn
			margin 0 auto
			border 0.461vw solid #000
			height 12.30vw
			width 46.92vw
			font-size 2.61vw
			padding 0 8px
			display block
			font-weight bold
			border-radius 3.07vw
			text-transform uppercase
			margin-bottom 3.07vw
			letter-spacing 2px
			background-color #fff !important
			color #000
</style>
