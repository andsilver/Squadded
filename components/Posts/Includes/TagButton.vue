<template>
	<v-btn ref="circle-button" class="tag-btn" icon @click="click">
		<v-icon class="tag-btn-icon" color="whte" small>
			mdi-circle
		</v-icon>
	</v-btn>
</template>
<script>
export default {
	methods: {
		click(e) {
			e.stopPropagation();
			this.$emit('click');
		},
	},
};
</script>
<style lang="stylus" scoped>
.tag-btn
	color white !important
	width 24px
	height 24px
	.tag-btn-icon
		height 16px
		width 16px
		border 12px solid rgba(0, 0, 0, 0.45)
		border-radius 50%
</style>
