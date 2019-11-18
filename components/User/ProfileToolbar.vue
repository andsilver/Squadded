<template>
	<section
		class="buttons"
		height="40"
	>
		<Menu v-if="user.isMe" :dark="isBgExist" @share="share" />
		<GoBackBtn v-else :dark="isBgExist" />
		<v-btn
			icon
			:dark="isBgExist"
			class="add_user_btn"
		>
			<v-icon>
				sqdi-add-user
			</v-icon>
		</v-btn>
		<v-btn
			icon
			:dark="isBgExist"
		>
			<v-icon>
				sqdi-shopping-bag
			</v-icon>
			<span class="shopping_bag_count">4</span>
		</v-btn>
		<span
			v-if="!isBgExist"
			class="profile_title"
		>
			{{ $t('Profile') }}
		</span>

		<v-dialog v-model="showShare">
			<ShareProfile :user="user" />
		</v-dialog>
	</section>
</template>

<script>
import Menu from './Menu';
import ShareProfile from './ShareProfile';
import GoBackBtn from '~/components/common/GoBackBtn';

export default {
	components: {
		Menu,
		GoBackBtn,
		ShareProfile,
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		isBgExist: true,
		showShare: false,
	}),
	methods: {
		share () {
			this.showShare = true;
		},
	},
};
</script>

<style lang="stylus" scoped>
	.buttons
		position relative
	.v-btn
		width 40px !important
		height 40px !important
		i
			font-size 1.5em !important

	.shopping_bag_count
		position absolute

		bottom -6px
		right 6px

		width 14px
		height 14px
		font-size 9px
		line-height 14px

		color #fff
		background-color #FD6256
		border-radius 50%
		font-weight 900

	.buttons
		display flex
		width 100%

	.add_user_btn
		margin-left auto

	.profile_title
		position: absolute
		width 100%
		height 40px
		line-height 40px
		text-align center
		font-weight 700
		font-size .85em
</style>
