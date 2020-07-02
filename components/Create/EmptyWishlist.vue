<template>
	<div v-if="!isWishlistHasItems" class="empty_wishlist_container">
		<div class="whislist_empty">
			<div class="whish_img" />
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
import { createNamespacedHelpers, mapState } from 'vuex';
import Button from '~/components/common/Button';
import { discoverItem } from '~/components/Whishlist/discoverItem';
import { UserStore } from '~/store/user';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		Button,
	},
	computed: {
		...userState(['me']),
		...mapState([
			'merchant',
		]),
		isWishlistHasItems () {
			const { wishlist } = this.$store.state.activity;
			return wishlist && wishlist.length;
		},
	},
	methods: {
		discoverItem,
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
			width 10.76vw
			height 10.76vw
			position absolute
			background #000 url('~assets/img/squad-logo-white.svg') no-repeat
			background-size 6.15vw 4.66vw
			background-position center center
			border-radius 50%
			box-shadow 0 0 0 2.3vw #b8b8ba, 0 0 0 6.1vw #dbdbdb
			right 1.8vw
			top 1.8vw
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
			min-width 46.92vw
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
