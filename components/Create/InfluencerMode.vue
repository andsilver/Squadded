<template>
	<div class="influencer-mode">
		<div class="img">
			<img src="~assets/img/action-share.svg">
		</div>
		<div class="text">
			<h4>
				{{ $t('influencerMode.caption') }}
			</h4>
			<p>
				{{ $t('influencerMode.description') }}
			</p>
			<span class="right">
				<v-btn icon>
					<v-icon>
						sqdi-arrow-point-to-right
					</v-icon>
				</v-btn>
			</span>
		</div>
	</div>
</template>

<style lang="stylus" scoped>
.influencer-mode
	display flex
	width 100%
	.img
		width 8.30vw
		height 8.30vw
		background rgba(218, 217, 221, 0.30)
		border-radius 50%
		line-height 5.6vw
		text-align center
		img
			transition all 0.12s ease-in-out
			transform scale(1)
			width 3.38vw
			height 3.38vw
			vertical-align -webkit-baseline-middle
			vertical-align -moz-middle-with-baseline

	.text
		font-size 3.23vw
		text-align left
		color #000000
		font-weight 700
		padding-left 4.61vw
		margin-top 5px
		position relative
		width calc(100% - 8vw)
		p
			color #B8B8BA
			font-weight 500
			margin 6px 0 0 0 !important
			font-size 3.23vw
		span.right
			position absolute
			right 4px
			top -5px
			max-width 23.3vw
			@media screen and (max-width 280px)
				max-width 26vw
</style>
