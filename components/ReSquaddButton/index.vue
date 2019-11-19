<template>
	<button
		ref="resquadd-button"
		class="resquadd sqdi-squadded-icon"
		:class="{ 'is-resquadded': item.squadded }"
		@click="click"
	/>
</template>

<script>
import { FeedStore, FeedActions, FeedMutations } from '~/store/feed';
import { ActivityStore, ActivityActions } from '~/store/activity';

export default {
	name: 'ReSquaddButton',
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	methods: {
		click () {
			return this.item.squadded ? this.unwish() : this.reSquaddPost();
		},
		reSquaddPost () {
			this.item.squadded = true;
			this.$store.dispatch(`${FeedStore}/${FeedActions.reSquaddItem}`, { item: this.item });
			this.$forceUpdate();
		},
		async unwish () {
			this.item.squadded = false;
			await this.$store.dispatch(`${ActivityStore}/${ActivityActions.unwish}`, this.item);
			this.$store.commit(`${FeedStore}/${FeedMutations.unsquadd}`, this.item.itemId);
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
