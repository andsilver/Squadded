<template>
	<section class="feed">
		<section class="d-flex text-section">
			<v-avatar size="40" class="squa-avatar">
				<v-icon size="5.53vw" color="#000000">
					sqdi-squadded-icon
				</v-icon>
				<v-icon dark size="2.52vw" class="check-icon">
					sqdi-checkmark
				</v-icon>
			</v-avatar>
			<div class="notification-message">
				<div class="message is_poll">
					<span>
						{{ $t('notify.emptyWelcomeText') }} <b> {{ $t('notify.emptySquaddedText', { merchant: $store.state.merchant.id }) }} </b> {{ $t('notify.emptySquaddedEndText') }}
					</span>
				</div>
			</div>
		</section>
	</section>
</template>

<script>

export default {
	name: 'PollEnd',

};
</script>

<style lang="stylus" scoped>
.feed
	width 100%
	margin-top 3.69vw
	overflow-y auto
	section.text-section
		padding 2.46vw
		border 0.15vw solid #f5f5f5
		border-bottom 0px
		font-size 3.38vw
		line-height 4.5vw
		background-color #f5f5f5
i.sqdi-checkmark
	margin-top 2px
.time-string
	font-size 2.92vw
	vertical-align middle
	color #B8B8BA
	margin-left 0.6VW
.time-string-section
	margin-top 0.6VW
	display block
.imgae-section
	display inline-block
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
	.notification-image
		width 9.230vw
		max-height 13.38vw
	span.poll-images
		width 18.95vw
		display flex
		vertical-align middle
		img.notification-image
			&:first-child
				margin-right 0.4vw
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
.notification-message
	width 100%
	cursor pointer
	align-self center
	.message
		width calc(100% - 10.2vw)
		padding-right 1.93vw
		display inline-block
		vertical-align top
		&.is_poll
			width 100%
.v-avatar.squa-avatar
	margin-right 12px
	border 0.461vw solid #000000
	background-color #fff
	position relative
	overflow visible
	.check-icon
		position absolute
		width 5.60vw
		height 5.53vw
		background-color #FD6256
		border 0.61vw solid
		bottom -7px
		left -2px
		&::before
			margin-top 3px
</style>
