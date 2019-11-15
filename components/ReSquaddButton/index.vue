<template>
	<button
		ref="resquadd-button"
		class="resquadd sqdi-squadded-icon"
		:class="{ 'is-resquadded': item.squadded }"
		@click="reSquaddPost"
	/>
</template>

<script>
import { FeedStore, FeedActions } from '~/store/feed';

export default {
	name: 'ReSquaddButton',
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	methods: {
		reSquaddPost () {
			this.item.squadded = true;
			this.$store.dispatch(`${FeedStore}/${FeedActions.reSquaddItem}`, { item: this.item });
			this.$forceUpdate();
		},
	},
};
</script>

<style scoped lang="stylus">
.resquadd
	position absolute
	right 8%
	top 8%
	width 30px
	height 30px
	border-radius 50%
	background-color #707070
	color white
	text-align center
	opacity .5
	outline none
	transition background-color .1s ease-in-out 0s,
		opacity .1s ease-in-out 0s

	&.sqdi-squadded-icon
		&:before
			vertical-align middle
			line-height 30px

	&.is-resquadded
		background-color black
		opacity 1
</style>
