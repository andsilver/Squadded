<template>
	<v-card
		class="mx-auto mb-6 pa-4 product_card"
		:elevation="1"
		:loading="loading"
	>
		<v-img
			ref="item-image"
			:src="item.img"
			@click="openProduct"
		/>
		<ReSquaddButton
			:item="item"
		/>
		<section class="card_bottom">
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
				@click="openProduct"
			>
				<span>{{ item.title }}</span>
			</v-card-title>
			<button
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
			default: () => {},
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		openProduct () {
			SquadAPI.openProduct(this.item);
		},
	},
};
</script>

<style lang="stylus" scoped>
	.product_card
		width 78%
		border-radius 0 !important
		box-shadow 0 2px 4px rgba(0, 0, 0, 0.1) !important

		.card_bottom
			margin-top 2%

		.post_price
			padding 0

		.post_price span
			font-size .9em
			font-weight 700

		.post_title
			margin-top 1%
			padding 0
			width 85%

		.post_title span
			min-height 12px
			max-height 20px
			word-break normal
			overflow hidden
			font-size 10px
			line-height 10px
			font-weight 500
			color #B8B8BA

		.buy_button
			width 30px
			height 30px
			position absolute
			right 5%
			bottom 4%

		.sqdi-shopping-bag-2:before
			position absolute
			font-size 1.3em
			right -30%
			top 10%
</style>
