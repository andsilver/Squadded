<template>
	<v-text-field
		ref="text-field"
		hide-details
		:placeholder="placeholder"
		@input="(value) => $emit('input', value)"
	>
		<v-avatar
			slot="prepend"
			min-width="none"
			height="8.307vw"
			width="8.307vw"
		>
			<v-img
				:src="avatar"
			/>
		</v-avatar>
	</v-text-field>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
	},
	computed: {
		avatar () {
			return this.$store.state.user.me.avatar;
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-input
	font-size: 3.230vw;
	color: #000000;
	font-weight: 500;
	background-color #F4F4F5
	border-radius: 6.153vw;
	margin: 0 12px;
	padding: 1.538vw;
	>>> .v-input__slot:after
		display none
	>>> .v-input__prepend-outer
		margin 0 1.538vw 0 0
	&.input-section
		margin-top 1vw
		width 100%
.video-input
	.v-input
	&.input-section
		margin-top 0
		width 100%
		margin-left 0
</style>
