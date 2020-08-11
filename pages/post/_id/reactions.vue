<template>
	<v-container class="reaction-section">
		<BackBar ref="back-bar" :title="$t('post.reactions')" />
		<v-layout v-if="post" flex-column>
			<div class="d-flex align-center user-section">
				<UserLink ref="user-link" :user="post.user" />
				<span ref="user-name-type" class="user-name-type">
					<span class="user-name">{{ post.user.name || post.user.screenName }}</span>
					<span v-if="post.type == 'singleItemPost'">{{ $t('post.addedItem') }}</span>
					<span v-if="post.type == 'outfitPost'">{{ $t('post.addedOutfit', {'0': post.items.length}) }} </span>
					<span v-if="post.type == 'pollPost'">{{ $t('post.addedPoll', {'0': 3}) }} </span>
					<span v-if="post.type == 'galleryPost'">{{ $t('post.addedGallary', {'0': post.items.length}) }} </span>
					<span v-if="post.type == 'videoPost'">{{ $t('post.addedVideo', {'0': post.items.length}) }} </span>
				</span>
				<span ref="product-image" class="product-image">
					<img v-if="post.type == 'singleItemPost'" :src="post.item.img" class="item-image">
					<img v-if="post.type == 'outfitPost'" :src="post.items[0].img" class="item-image">
					<span v-if="post.type == 'outfitPost'" class="item-mast-count">+{{ (post.items.length - 1) }}</span>
					<span v-if="post.type == 'pollPost'" class="poll-images">
						<img v-if="post.type == 'pollPost'" :src="post.item1.img" class="item-image">
						<img v-if="post.type == 'pollPost'" :src="post.item2.img" class="item-image">
						<span class="poll-icon">
							<img src="~assets/img/poll-arrows.svg" class="poll-image">
						</span>
					</span>
					<img v-if="post.type == 'galleryPost'" :src="post.img" class="item-image">
				</span>
			</div>
			<v-tabs
				v-model="tabs"
				class="px-1"
				fixed-tabs
				centered
				@change="keepTab"
			>
				<v-tab class="tabs bottom-line">
					<span style="text-transform: capitalize;">{{ $t('Comments') }}</span>
				</v-tab>
				<v-tab class="tabs bottom-line">
					<span style="text-transform: capitalize">{{ $t('Likes') }}</span>
				</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tabs" class="tab-result-section">
				<v-tab-item>
					<Comments ref="comments-tab" :post="post" />
				</v-tab-item>
				<v-tab-item>
					<Likes ref="likes-tab" :post="post" />
				</v-tab-item>
			</v-tabs-items>
		</v-layout>
	</v-container>
</template>

<script>
import BackBar from '~/components/common/BackBar';
import Comments from '~/components/Comments';
import Likes from '~/components/Likes';
import UserLink from '~/components/UserLink';
import { PostStore, PostGetters, PostMutations } from '~/store/post';
import { prefetch } from '~/helpers';

export default {
	name: 'PostReactions',
	components: {
		BackBar,
		Comments,
		Likes,
		UserLink,
	},
	data: () => ({
		post: null,
		tabs: null,
	}),
	created () {
		if (this.$route.hash === '#likes') {
			this.tabs = 1;
		}
		const { id } = this.$route.params;
		this.setPost(id);
	},
	mounted () {
		this.$root.$emit('hideToolbarHide', {});
	},
	beforeDestroy() {
		this.$root.$emit('showToolbarHide', {});
	},
	methods: {
		keepTab () {
			// Keep commented in future we need to add #path in URL
			// this.$router.push({ hash: this.tabs ? 'likes' : '' });
		},
		setPost(id) {
			this.post = this.$store.getters[`${PostStore}/${PostGetters.getPostById}`](id);

			if (this.post) {
				return;
			}
			prefetch({
				postId: id,
				mutation: `${PostStore}/${PostMutations.setCurrentPost}`,
				store: this.$store,
				type: 'fetchPost',
			}).then((post) => {
				this.post = post;
			});
		},
	},
	head: () => ({
		title: 'Post-Reactions',
	}),
};
</script>

<style lang="stylus" scoped>
.reaction-section
	.user-section
		background-color #F5F5F5
		margin-top 12px
		margin-left -12px
		margin-right -12px
		padding-left 14px
		padding-right 14px
		font-size 3.38vw
	.tabs
		&.bottom-line
			border-bottom 2px solid rgba(184,184,186,0.30)
	.v-tab--active,
	>>> .v-tabs-slider
		color var(--brand-color)
	span.user-name-type
		width 100%
		padding-right 2vw
		.user-name
			font-size 3.38vw
			font-weight 600
	img.item-image
		width 9.23vw
		vertical-align middle
		max-height 13.38vw
	.tab-result-section
		padding-left 12px
		position relative
		padding-top 4.615vw
		&::before
			background -moz-linear-gradient(top,  rgba(218,217,221,0.3) 0%, rgba(255,255,255,0) 100%)
			background -webkit-linear-gradient(top,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
			background linear-gradient(to bottom,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
			height 4.615vw
			width calc(100% + 28px)
			content ''
			left -14px
			position absolute
			top 0px
	span.product-image
		position relative
		span.item-mast-count
			position: absolute
			top 0px
			left 0px
			width 100%
			height 100%
			z-index 1
			background-color rgba(0,0,0,0.40)
			color #fff
			font-size 4VW
			font-weight 500
			text-align center
			padding-top 30%
	span.poll-images
		width 18.95vw
		display flex
		vertical-align middle
		img.item-image
			&:first-child
				margin-right 0.6vw
		span.poll-icon
			width 4.29vw
			height 4.29vw
			background-color #000
			border-radius 50%
			display flex
			justify-content center
			left 40%
			top 30%
			position absolute
			border 0.6vw solid #f5f5f5
			img.poll-image
				width 2vw
				margin-left 0.1vw
</style>
