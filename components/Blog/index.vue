<template>
	<section>
		<Preloader v-if="!blog && socket.isAuth" ref="preloader" class="mt-8" />
		<span v-else-if="!blog || !blog.length">
			<div class="empty_feed">
				<p class="feed_img"><img src="~assets/img/empty-feed.svg"></p>
				<p ref="empty-blog-text" align="center" class="txt">
					{{ socket.isAuth ? $t('feed.isEmpty') : $t('wishlist.disabled_before_signin') }}
				</p>
				<Button v-if="isMe" class="flex-grow-1 wish_btn" :active="false" @click.native="createPost">
					{{ $t('feed.create') }}
				</Button>
			</div>
		</span>
		<Feed v-else :items="blog" @loadMore="fetchBlog" />
	</section>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Feed from '~/components/Feed';
import Button from '~/components/common/Button';
import Preloader from '~/components/Preloader';
import { ActivityStore, ActivityActions } from '~/store/activity';
import { tokenExist } from '~/utils/isAuth';
import { UserStore } from '~/store/user';
import {
	postTab,
	visiblePosts,
} from '~/consts';

const activityState = createNamespacedHelpers(ActivityStore).mapState;
const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	name: 'Blog',
	components: {
		Feed,
		Preloader,
		Button,
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
			'blog',
		]),
		...mapState([
			'merchant',
			'socket',
		]),
		visiblePosts,
		postTab,
	},
	created () {
		this.fetchBlog();
	},
	methods: {
		createPost () {
			if (this.visiblePosts.length === 1) {
				this.$router.push(this.postTab.uri);
			} else {
				this.$root.$emit('openCreateMenu');
			}
		},
		fetchBlog() {
			if (!tokenExist()) {
				return;
			}
			this.$store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, {
				type: 'blog',
				guid: this.$route.params.id,
			});
		},
	},
};
</script>
<style lang="stylus" scoped>
.empty_feed
	width 82.15vw
	margin 13.38vw auto 0
	text-align center
	.feed_img
		background rgba(218,217,221,0.30)
		width 30.76vw
		height 30.76vw
		display flex
		justify-content center
		align-items center
		border-radius 50%
		margin 0 auto
		img
			width 16.76vw
			height 16.76vw
	.txt
		font-size 3.69vw
		font-weight 500
		color #000
		margin-top 3.69vw
	.wish_btn
		margin 0 auto
		border 0.461vw solid #000
		height 12.30vw
		width 53.05vw
		font-size: 2.61vw
		padding: 0 8px
		display: block
		font-weight bold
		border-radius 3.07vw
		text-transform uppercase
		margin-bottom 3.07vw
		letter-spacing 2px
</style>
