<template>
	<div v-if="!isPoll" class="selected-items mt-2">
		<span
			v-for="post in getSelected"
			:key="post.item.itemId"
			class="selected-item-img selected"
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
	<div v-else-if="isPoll" class="selected-items mt-2">
		<span
			v-if="getSelected.length > 0"
			:key="getSelected[0].item.itemId"
			class="selected-item-img selected poll"
		>
			<v-img
				:key="getSelected[0].item.img"
				:src="getSelected[0].item.img"
			/>
			<v-icon size="1.84vw" @click.native="getSelected[0].selected = false">
				sqdi-close-cross
			</v-icon>
		</span>
		<span v-if="isPoll && getSelected.length == 0" class="selected-item-img poll">
			<v-img />
		</span>
		<span class="selected-item-img vs-icon poll">vs</span>
		<span
			v-if="getSelected.length == 2"
			:key="getSelected[1].item.itemId"
			class="selected-item-img selected poll"
		>
			<v-img
				:key="getSelected[1].item.img"
				:src="getSelected[1].item.img"
			/>
			<v-icon size="1.84vw" @click.native="getSelected[1].selected = false">
				sqdi-close-cross
			</v-icon>
		</span>
		<span v-if="isPoll && getSelected.length != 2" class="selected-item-img poll">
			<v-img />
		</span>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { ActivityStore, ActivityGetters } from '~/store/activity';

const { mapGetters } = createNamespacedHelpers(ActivityStore);

export default {
	props: {
		isPoll: {
			type: Boolean,
			default: false,
		},
	},
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
		background-color rgba(184,184,186,0.3)

.selected-item-img
	display inline-block
	border-radius 3.076vw
	position relative
	margin 0 4.615vw 0 0
	width 15.384vw
	overflow hidden
	height 23.076vw
	&.poll
		margin 0 3.69vw 0 0
	&.selected
		box-shadow 0 6.15vw 6.15vw rgba(0,0,0,0.1)
	&.vs-icon
		width auto
		line-height 23.076vw
		font-size 3.69vw
		font-weight 700
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
.photo-create
	.selected-item-img
		margin-top 0px
		width 6.963vh
		height 10.44vh
		box-shadow 0 0.92vw 6.15vw rgba(0,0,0,0.1)
		&:after
			width 100%
			content ''
			position absolute
			height 100%
			top 0
			left 0
			background-color rgba(0,0,0,0.4)
		.sqdi-close-cross
			border none
			&:before
				background-image url('~assets/img/remove-photo.svg')
				background-size 12px
				background-color #FD6256
				width 8.61vw
				height 8.61vw
				z-index 1
</style>
