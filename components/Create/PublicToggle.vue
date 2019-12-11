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
		</div>
	</div>
</template>

<script>
export default {
	data: () => ({
		isPublic: true,
	}),
	methods: {
		toggle() {
			this.isPublic = !this.isPublic;
		},
	},
};
</script>

<style lang="stylus" scoped>
.public-toggle
	display flex
	align-items center
	width:50%;
	padding-left 4.1538vw

	.img
		width 11.846vw
		height 11.846vw
		background rgba(218, 217, 221, 0.30)
		border-radius 50%
		line-height 8.846vw
		img
			transition all 0.12s ease-in-out
			transform scale(1)
			width 4.769vw
			height 4.769vw
			text-align center
			vertical-align -webkit-baseline-middle
			vertical-align -moz-middle-with-baseline
		&.is-active img.logo
			transform scale(1.1)

	.text
		font-size 3.230vw
		text-align left
		color #000000
		font-weight 700
		padding-left 2.153vw
		p
			color #B8B8BA
			font-weight 500
			margin 0 !important
</style>
