<template>
	<v-card
		class="card_frame"
		:class="{ is_poll: isPollPost }"
		:loading="loading"
	>
		<slot />
		<section class="card_bottom">
			<v-card-text
				ref="item-price"
				class="post_price"
				@click="() => $emit('open')"
			>
				<span>{{ price }}</span>
			</v-card-text>
			<v-card-title
				v-if="title"
				ref="item-title"
				class="post_title"
				@click="() => $emit('open')"
			>
				<span>{{ title }}</span>
			</v-card-title>
			<button
				v-if="showBag"
				ref="buy-button"
				class="buy_button sqdi-shopping-bag-2"
			/>
		</section>
	</v-card>
</template>

<script>
export default {
	name: 'CardFrame',
	props: {
		price: {
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
		showBag: {
			type: Boolean,
			default: true,
		},
	},
};
</script>

<style lang="stylus" scoped>
.card_frame
	border-radius 0 !important
	box-shadow 0 2px 4px rgba(0, 0, 0, 0.1)

	.card_bottom
		margin-top 2%

	.post_price
		padding 0
		span
			font-size 1em
			font-weight 700

	.post_title
		margin-top 1%
		padding 0
		width 85%
		span
			min-height 12px
			max-height 8.615vw
			word-break normal
			overflow hidden
			font-size 3.076vw
			line-height 4vw
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

	&.is_poll
		box-shadow none
		.card_bottom
			padding-top 0
			margin-top 4%
		.post_title
			width 80%
</style>
