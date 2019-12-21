<template>
	<h2>
		<GoBackBtn />
		{{ title }}
		<v-btn
			v-if="addUser"
			icon
			class="add-user-button"
		>
			<v-icon color="#000">
				sqdi-add-user
			</v-icon>
		</v-btn>
	</h2>
</template>

<script>
import GoBackBtn from '~/components/common/GoBackBtn';

export default {
	components: {
		GoBackBtn,
	},
	props: {
		title: {
			type: String,
			default: '',
		},
		addUser: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="stylus" scoped>
h2
	color #000
	font-size 4.307vw
	font-weight bold
	text-align center
	padding-bottom 0px
	position relative
	line-height 36px

	button
		position absolute
		left 0
		&.add-user-button
			right 0
			left auto
</style>
