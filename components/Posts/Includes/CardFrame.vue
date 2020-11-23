<template>
	<v-card
		class="card_frame"
		:class="{ is_poll: isPollPost }"
		:loading="loading"
	>
		<slot />
		<div v-if="showTap && !isPaired" class="tap-photo">
			{{ post && post.type === 'videoPost' ? $t('tip.tapHere') : $t('tip.tapPhotos') }}
		</div>
		<section v-if="!isPaired" class="card_bottom" :class="{ card_inline: title }">
			<div ref="merchant-id" class="post_title merchant-section d-flex justify-space-between align-center px-1">
				<span v-if="item && item.merchantId" @click="() => $emit('open')">{{ item.merchantSiteTitle || item.merchantId }}</span>
				<div v-if="showPaired" class="refresh-icon" @click="navigateToPairedItemPage">
					<img src="~assets/img/recycle.svg" class="refresh-logo">
				</div>
			</div>
			<div
				v-if="title"
				ref="item-title"
				class="caption font-weight-medium px-1 word-break"
				:style="{ width: isPollPost ? '40vw' : 'unset' }"
				@click="() => $emit('open')"
			>
				{{ title }}
			</div>
			<v-card-text
				v-if="!details && price"
				ref="item-price"
				class="post_price px-1"
				@click="() => $emit('open')"
			>
				<span v-if="discount" class="original-price">{{ originPrice }}</span>
				<span :class="{ discount }">{{ price }}</span>
				<span v-if="showTap" class="for-all">{{ $t('forAllItems', {'0': postLength}) }}</span>
			</v-card-text>
			<Actions v-if="groupPost" :group-post="groupPost" :post="post" />
		</section>
	</v-card>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import Actions from './Actions';
import { shortNumber } from '~/helpers';
import { checkActionPermission } from '~/utils/isAuth';
import { FeedPost } from '~/classes/FeedPost';
import { UserStore } from '~/store/user';
import { MERCHAND_ADMIN, GA_ACTIONS } from '~/consts';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	name: 'CardFrame',
	components: {
		Actions,
	},
	props: {
		price: {
			type: [Number, String],
			default: '',
		},
		originPrice: {
			type: [Number, String],
			default: '',
		},
		title: {
			type: [Number, String],
			default: '',
		},
		isPollPost: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		showTap: {
			type: Boolean,
			default: false,
		},
		postLength: {
			type: Number,
			default: 0,
		},
		showRefresh: {
			type: Boolean,
			default: false,
		},
		lightRefresh: {
			type: Boolean,
			default: false,
		},
		item: {
			type: Object,
			required: false,
			default: () => {},
		},
		details: {
			type: Boolean,
			default: false,
		},
		postId: {
			type: String,
			default: null,
			required: false,
		},
		isPaired: {
			type: Boolean,
			default: false,
		},
		groupPost: {
			type: Boolean,
			default: false,
		},
		post: {
			type: FeedPost,
			required: false,
			default: () => {},
		},
	},
	computed: {
		...userState(['me']),
		...mapState([
			'merchant',
		]),
		discount () {
			return this.originPrice && this.originPrice !== this.price;
		},
		showPaired() {
			return this.me.userRole === MERCHAND_ADMIN || (this.showRefresh && !this.merchant.hideFeatures.includes('paired item'));
		},
	},
	methods: {
		short(number) {
			return number ? shortNumber(number, this._i18n.locale) : 0;
		},
		async navigateToPairedItemPage(e) {
			e.stopPropagation();
			if (!this.item.itemId || !this.postId) {
				return;
			}
			const allow = await checkActionPermission(this.$store, this.$root);

			if (!allow) {
				return;
			}
			this.$router.push(`/paired-item?postId=${this.postId}&itemId=${this.item.itemId}&varId=${this.item.varId}`);
			this.$gaActionPrivate(GA_ACTIONS.POST_PAIREDITEMS);
		},
	},
};
</script>

<style lang="stylus" scoped>
.compare-two
	.card_frame
		&.is_poll
			margin-bottom 15px
.card_frame
	cursor pointer
	border-radius 12px !important
	box-shadow: -2px 3px 11px 0px rgba(0, 0, 0, 0.1	) !important

	.card_bottom
		margin-top 1%
		&.card_inline
			position relative
			padding-left 0
			padding-right 0
		.merchant-section
			height 6.15vw
	.post_price
		padding 0
		margin-top -1px
		@media screen and (max-width: 280px)
			height 5vw
			margin-top -3px
		span
			font-size 3.69vw
			font-weight 700
			&.for-all
				font-size 3.230vw
				font-weight 500
				color #B8B8BA
				background #F4F4F5
				padding 0 2.153vw
				border-radius 0.76vw
				margin-left 1px
			&.discount
				color #FD6256
			&.original-price
				margin-right 0.3vw
				text-decoration line-through
				font-weight 400

	.post_title
		span
			word-break normal
			overflow hidden
			font-size 3.23vw
			line-height 4vw
			font-weight 500
			color #B8B8BA
			text-transform uppercase

	.word-break
		word-break normal
		overflow hidden
		text-overflow ellipsis
		white-space nowrap
		font-size 3.23vw !important
		line-height: 3.5vw !important;

	.sqdi-shopping-bag-2:before
		width 30px
		position absolute
		font-size 1.3em
		left auto
		right 0
		top 10%

	&.is_poll
		box-shadow none
		.card_bottom
			padding-top 0
			margin-top 4%
		.post_title
			width 100%
			margin-top 8px
	.tap-photo
		font-size 3.3846vw
		text-align center
		margin-top 3vw
		margin-bottom 3vw
		color #B8B8BA
		font-weight 500
	.refresh-icon
		cursor pointer
		width 5.8vw
		text-align right
		.refresh-logo
			width: 4.12VW;
		.refresh-count
			border-radius 1.846vw
			font-size 2.461vw
			font-weight 600
			width 4.923vw
			height 3.7vw
			background #B8B8BA
			display inline-block
			text-align center
			color #fff
			position absolute
			bottom 4.307vw
			left 3.307vw
			line-height: 3.7vw
	>>> .v-image__image--preload
		&:first-child
			padding-bottom 125%
			position relative
		background #f1f1f1
		flex-shrink 0

&.single-item
	.sqdi-shopping-bag-2:before
		top: 0
	.card_bottom
		margin-top 2%
.gallery-card
	.multi-item .card_bottom
		display none
	.tap-photo
		margin-top 4vw
		margin-bottom 0px
.photo-create .card_frame.is_poll
	margin-bottom 5px
.poll-details
	.card_frame
		&.is_poll .post_title
			width 100%
		.post_title span
			font-size 3.23vw
			line-height 4.30vw
	.poll-item
		.card_frame.is_poll .card_bottom
			margin-top 0
			padding 3.29vw 4.61vw 3.29vw 0
	.poll-item:last-child
		.card_frame.is_poll .card_bottom
			border-left 1px solid rgba(184,184,186,0.4)
			margin-left -2px
			padding-left 4.61vw
			padding-right 0
			height 60px
	.refresh-icon
		display none
.paired_section
	.card_frame
		box-shadow	none

.single-item.card_frame .post_title span
	overflow hidden
	white-space nowrap
	text-overflow ellipsis
.poll-post-explore
	.card_bottom
		.post_title
			span
				color #000
.ending-poll-post
	.card_bottom.card_inline
		display flex
		flex-direction column
		.v-card__text.post_price
			order 2
.explore-content
	.refresh-icon .refresh-logo
		width 3.4vw
	.card_frame .post_price span
		margin-top 1.4vw
		display inline-block
	.card_frame .word-break
		width 35.5vw !important
.explore-outfit
	.card_bottom
		display none
.outfit-card
	.merchant-section
		height 0 !important
	.scroll-section
		.merchant-section
			height 6.15vw !important
</style>
