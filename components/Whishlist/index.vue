<template lang="html">
	<section>
		<Preloader v-if="!wishlist && socket.isAuth" ref="preloader" class="mt-8" />
		<div v-else-if="!wishlist || !wishlist.length" class="mt-3">
			<div class="whislist_empty">
				<template v-if="isPrivate && socket.isAuth && !isMe">
					<div ref="private-image" class="d-flex justify-center">
						<img src="~assets/img/lock.png" width="100px">
					</div>
					<div ref="private-text" class="txt text-center font-weight-medium" style="padding: 10px 50px">
						{{ $t('wishlist.private', { user: user.other.name || user.other.screenName }) }}
					</div>
				</template>
				<div v-else>
					<div class="whish_img">
						<p>
							<img src="~assets/img/squad-logo-white.svg" class="insta-image">
						</p>
					</div>
					<div class="txt">
						<p ref="empty-whishlist-text" align="center">
							{{ socket.isAuth ? $t('wishlist.empty') : $t('wishlist.disabled_before_signin') }}
						</p>
						<Button v-if="isMe" class="flex-grow-1 wish_btn" @click="discoverItem">
							{{ $t('wishlist.discover') }}
						</Button>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<WhishlistItem
				v-for="(post, n) in wishlist"
				:key="n"
				:post="post"
			/>
		</div>
	</section>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import WhishlistItem from './item';
import Preloader from '~/components/Preloader.vue';
import { ActivityStore, ActivityActions } from '~/store/activity';
import { onAuth } from '~/helpers';

const activityState = createNamespacedHelpers(ActivityStore).mapState;

export default {
	name: 'Whishlist',
	components: {
		Preloader,
		WhishlistItem,
	},
	props: {
		isMe: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		...activityState([
			'wishlist',
			'isPrivate',
		]),
		...mapState([
			'socket',
			'user',
		]),
	},
	created () {
		this.fetchWishlist();
	},
	mounted() {
		window.addEventListener('scroll', this.onScroll);
	},
	destroyed() {
		window.removeEventListener('scroll', this.onScroll);
	},
	methods: {
		onScroll (e) {
			const bottomOfWindow = Math.max(
				window.pageYOffset,
				document.documentElement.scrollTop,
				document.body.scrollTop,
			) + window.innerHeight === document.documentElement.offsetHeight;

			if (bottomOfWindow) {
				this.fetchWishlist();
			}
		},
		async fetchWishlist() {
			await onAuth(this.$store);
			this.$store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, {
				type: 'wishlist',
				guid: this.$route.params.id,
			});
		},
		discoverItem() {
			this.$router.push('/explore');
		},
	},
};
</script>

<style lang="stylus" scoped>
.whislist_empty
	width 82.15vw
	margin 13.38vw auto 0
	.whish_img
		width 53.53vw
		height 27.69vw
		background #F5F5F5
		margin 0 auto
		position relative
		p
			position absolute
			right 2.5vw
			top 2.7vw
			background #000000
			border-radius 50%
			width 8.61vw
			height 8.61vw
			display flex
			justify-content center
			align-items center
			margin 0
			z-index 1
			img
				width 4.92vw
				height 3.69vw
		&:after
			content ''
			width 12.30vw
			height 12.30vw
			position absolute
			background #B8B8BA
			border-radius 50%
			z-index 0
			right 0.76vw
			top 0.76vw
		&:before
			content ''
			width 18.46vw
			height 18.46vw
			position absolute
			background #DBDBDB
			border-radius 50%
			z-index 0
			right -2.30vw
			top -2.30vw
	.txt
		p
			font-size 3.69vw
			font-weight 500
			color #000
			margin-top 3.69vw
		.wish_btn
			margin 0 auto
			border 0.461vw solid #000
			height 12.30vw
			width 46.92vw
			font-size: 2.61vw
			padding: 0 8px
			display: block
			font-weight bold
			border-radius 3.07vw
			text-transform uppercase
			margin-bottom 3.07vw
			letter-spacing 2px
</style>
