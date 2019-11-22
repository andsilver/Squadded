<template>
	<v-card
		class="product_card"
		:class="isPollPost ? 'without_shadow' : ''"
		:loading="loading"
	>
		<v-img
			ref="item-image"
			:key="item.img"
			:src="item.img"
			@click="openProduct"
		/>
		<ReSquaddButton
			v-if="showSquaddedButton"
			class="reSquaddButton"
			:item="item"
		/>
		<section
			class="card_bottom"
			:class="isPollPost ? 'poll_card_bottom' : ''"
		>
			<v-card-text
				ref="item-price"
				class="post_price"
				@click="openProduct"
			>
				<span>{{ item.price }}</span>
			</v-card-text>
			<v-card-title
				ref="item-title"
				class="post_title"
				:class="isPollPost ? 'poll_card_post_title' : ''"
				@click="openProduct"
			>
				<span>{{ item.title }}</span>
			</v-card-title>
			<button
				v-if="!nonClickable && (voted || !isPollPost)"
				ref="buy-button"
				class="buy_button sqdi-shopping-bag-2"
			/>
		</section>
	</v-card>
</template>

<script>
import ReSquaddButton from '~/components/ReSquaddButton';
import { SquadAPI } from '~/services/SquadAPI';

export default {
	name: 'ProductCard',
	components: {
		ReSquaddButton,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		nonClickable: {
			type: Boolean,
			default: false,
		},
		isPollPost: {
			type: Boolean,
			default: false,
		},
		voted: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		showSquaddedButton() {
			if (this.nonClickable) {
				return false;
			}
			if (!this.isPollPost) {
				return true;
			}
			if (this.voted) {
				return true;
			}
			return false;
		},
	},
	methods: {
		openProduct () {
			!this.nonClickable && SquadAPI.openProduct(this.item);
		},
	},
};
</script>

<style lang="stylus" scoped>
	.product_card
		border-radius 0 !important
		box-shadow 0 2px 4px rgba(0, 0, 0, 0.1)

		.card_bottom
			margin-top 2%

		.post_price
			padding 0

		.post_price span
			font-size 1em
			font-weight 700

		.post_title
			margin-top 1%
			padding 0
			width 85%

		.post_title span
			min-height 12px
			max-height 24px
			word-break normal
			overflow hidden
			font-size 10px
			line-height 12px
			font-weight 500
			color #B8B8BA

		.buy_button
			width 30px
			height 30px
			position absolute
			right 4%
			bottom 4%

		.sqdi-shopping-bag-2:before
			width 30px
			position absolute
			font-size 1.3em
			left auto
			right 0
			top 10%

	.product_card.without_shadow
		box-shadow none

	.product_card .poll_card_bottom
		padding-top 0
		margin-top 4%

	.product_card .poll_card_post_title
		width 80%

	.reSquaddButton
		z-index: 2;
</style>
