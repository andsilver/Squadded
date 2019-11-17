<template>
	<section
		class="buttons"
		height="40"
	>
		<v-btn v-if="isMe" icon :class="{whiteText: isBgExist}">
			<v-icon>
				sqdi-more
			</v-icon>
		</v-btn>
		<GoBackBtn v-else :class="{whiteText: isBgExist}" />
		<v-btn
			icon
			class="add_user_btn"
			:class="{whiteText: isBgExist}"
		>
			<v-icon>
				sqdi-add-user
			</v-icon>
		</v-btn>
		<v-btn
			icon
			:class="{whiteText: isBgExist}"
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
			{{ $t('Profile') }}</span>
	</section>
</template>

<script>
import GoBackBtn from '~/components/common/GoBackBtn';

export default {
	components: {
		GoBackBtn,
	},
	props: {
		isMe: Boolean,
	},
	data: () => {
		return {
			isBgExist: true,
		};
	},
};
</script>
<style lang="stylus" scoped>
    .buttons
        position relative
    .v-btn
        width 40px !important
        height 40px !important
        background-color transparent

    .v-btn i
        background-color transparent
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

    .whiteText
        color white !important

    .profile_title
        position: absolute
        width 100%
        height 40px
        line-height 40px
        text-align center
        font-weight 700
        font-size .85em
</style>
