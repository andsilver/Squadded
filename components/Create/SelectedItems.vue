<template>
	<div class="selected-items mt-2">
		<span
			v-for="post in getSelected"
			:key="post.item.itemId"
			class="selected-item-img"
		>
			<v-img
				:key="post.item.img"
				:src="post.item.img"
			/>
			<v-icon size="1.84vw" @click.native="post.selected = false">
				sqdi-close-cross
			</v-icon>
		</span>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { ActivityStore, ActivityGetters } from '~/store/activity';

const { mapGetters } = createNamespacedHelpers(ActivityStore);

export default {
	computed: {
		...mapGetters([
			ActivityGetters.getSelected,
		]),
	},
};
</script>

<style lang="stylus" scoped>
.selected-items
	padding 0 12px
	.v-responsive.v-image
		height 23.076vw

.selected-item-img
	display inline-block
	border-radius 3.076vw
	position relative
	margin 4.92vw 4.615vw 0 0
	width 15.384vw
	overflow hidden
	height 23.076vw
	.v-icon
		border 1.538vw solid rgba(0, 0, 0, 0.3)
		border-radius 50%
		top calc(50% - 16px)
		left calc(50% - 16px)
		position absolute
		color #000000
	.sqdi-close-cross:before
		content ''
		width 5.538vw
		height 5.538vw
		background-color #fff
		text-align center
		line-height 5.538vw
		border-radius 50%
		background-image url('~assets/img/close.svg')
		background-size 8px
		background-position center
		background-repeat no-repeat
</style>
