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
					<div class="whish_img" />
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
		<Preloader v-if="wishlist && loading.wishlist" ref="preloader-more" class="mt-4 mb-4" />
	</section>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import WhishlistItem from './item';
import { discoverItem } from './discoverItem';
import Preloader from '~/components/Preloader.vue';
import { ActivityStore, ActivityActions } from '~/store/activity';
import { onAuth } from '~/helpers';
import { UserStore } from '~/store/user';

const activityState = createNamespacedHelpers(ActivityStore).mapState;
const userState = createNamespacedHelpers(UserStore).mapState;

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
		...userState(['me']),
		...activityState([
			'wishlist',
			'isPrivate',
			'loading',
		]),
		...mapState([
			'merchant',
			'socket',
			'user',
		]),
	},
	created () {
		this.fetchWishlist();
	},
	mounted() {
		document.body.addEventListener('scroll', this.onScroll);
	},
	destroyed() {
		document.body.removeEventListener('scroll', this.onScroll);
	},
	methods: {
		onScroll (e) {
			if (document.body.scrollTop > (document.body.scrollHeight - document.body.offsetHeight - 30)) {
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
		discoverItem,
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
		&:after
			content ''
			width 8.61vw
			height 8.61vw
			position absolute
			background #000 url('~assets/img/squad-logo-white.svg') no-repeat
			background-size 4.92vw 3.69vw
			background-position center center
			border-radius 50%
			box-shadow 0 0 0 1.94vw #b8b8ba, 0 0 0 5vw #dbdbdb
			right 2.5vw
			top 2.7vw
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
