<template>
	<div class="item-link" :class="{ isError }">
		<v-img :src="item.img" class="affliate-iamge" alt="" />
		<v-textarea
			v-model="url"
			no-resize
			:rows="6"
			hide-details
			:rules="[rules.required, rules.url]"
			class="affliate-link"
			@update:error="onError"
		/>
	</div>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		url: '',
		isError: false,
		rules: {
			url: v => (/^https?:\/\/[\w]+[-.\w]+\.[\w]+(\/.*)?/).test(v) || 'Please enter a valid url',
			required: v => !!v || 'Missing link',
		},
	}),
	mounted () {
		this.url = this.item.url;
	},
	methods: {
		onError (err) {
			this.isError = err;
		},
	},
};
</script>

<style lang="stylus" scoped>
.item-link
	display flex
	padding 4vw 0
	border-width 0 0 thin
	border-style solid
	border-color #DBDBDB
	&.isError
		border-color #FC6155
	.v-image
		border-radius 4vw
		margin-right 4vw
		flex 0.67 0 auto

	.v-text-field
		padding-top 0
		margin-top 0
		>>> .v-input__control > .v-input__slot:after
			content none
</style>
