<template>
	<button
		ref="resquadd-button"
		class="resquadd sqdi-squadded-icon"
		:class="{ 'is-resquadded': item.squadded }"
		@click="click"
	/>
</template>

<script>
import { ActivityStore, ActivityActions } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions, PostMutations } from '~/store/post';

export default {
	name: 'ReSquaddButton',
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	methods: {
		click (e) {
			this.item.squadded ? this.unwish() : this.reSquaddPost();
			e.stopPropagation();
			e.cancelBubble = true;
			return false;
		},
		async reSquaddPost () {
			this.item.squadded = true;
			const post = await this.$store.dispatch(`${PostStore}/${PostActions.reSquaddItem}`, { item: this.item });
			this.$store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
			this.$forceUpdate();
		},
		async unwish () {
			this.item.squadded = false;
			await this.$store.dispatch(`${ActivityStore}/${ActivityActions.unwish}`, this.item);
			this.$store.commit(`${PostStore}/${PostMutations.unsquadd}`, this.item.itemId);
			this.$forceUpdate();
		},
	},
};
</script>

<style scoped lang="stylus">
.resquadd
	position absolute
	right 2.50vw
	top 3.07vw
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
