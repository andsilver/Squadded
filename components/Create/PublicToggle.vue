<template>
	<div class="public-toggle">
		<div class="img" :class="{'is-active': isPublic}" @click="toggle">
			<img v-if="isPublic" src="~assets/img/public.svg" class="logo">
			<img v-else src="~assets/img/private.svg" class="logo">
		</div>
		<div class="text" :class="{'is-active': isPublic}" @click="toggle">
			<h4>
				{{ $t(isPublic ? 'public' : 'private') }}
			</h4>
			<p>
				{{ $t(isPublic ? 'publicToggle.forEveryone' : 'publicToggle.forPrivate') }}
			</p>
			<span class="toggle-lab">
				{{ $t('publicToggle.toggle') }}
			</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		public: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		isPublic: true,
	}),
	mounted () {
		this.isPublic = this.public;
	},
	methods: {
		toggle() {
			this.isPublic = !this.isPublic;
		},
	},
};
</script>

<style lang="stylus" scoped>
.poll-main-sec .public-toggle
	padding: 4VW 0;
.public-toggle
	display flex
	width:100%;
	.img
		width 8.30vw
		height 8.30vw
		background rgba(218, 217, 221, 0.30)
		border-radius 50%
		line-height 5.6vw
		text-align: center;
		img
			transition all 0.12s ease-in-out
			transform scale(1)
			width 3.38vw
			height 3.38vw
			vertical-align -webkit-baseline-middle
			vertical-align -moz-middle-with-baseline
		&.is-active img.logo
			transform scale(1.1)

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
		span.toggle-lab
			position absolute
			right 0
			top -3px
			padding 0.8vw 3.07vw
			background-color rgba(218,217,221,0.30)
			border-radius 3.07vw

</style>
