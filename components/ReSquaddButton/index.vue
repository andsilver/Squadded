<template>
	<button
		ref="resquadd-button"
		class="double_heart_button sqdi-squadded-icon"
		:class="{ 'is-resquadded': isReSquadded }"
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
			default: () => {},
		},
	},
	data: () => ({
		isReSquadded: false,
	}),
	methods: {
		async reSquaddPost () {
			await this.$store.dispatch(`${FeedStore}/${FeedActions.reSquaddItem}`, { item: this.item });
			this.setIsReSquadded(true);
		},
		setIsReSquadded (state) {
			this.isReSquadded = state;
		},
	},
};
</script>

<style scoped lang="stylus">
.double_heart_button
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
	transition background-color .3s ease-in-out 0s,
		opacity .3s ease-in-out 0s

	&.sqdi-squadded-icon
		&:before
			width 30px
			margin 5% 0 0 0
			text-align center

	&.is-resquadded
		background-color black
		opacity 1
</style>
