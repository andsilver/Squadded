<template>
	<v-btn ref="circle-button" class="tag-btn" icon @click="click">
		<v-icon class="tag-btn-icon" color="whte" :style="tagButtonIconStyle">
			mdi-circle
		</v-icon>
	</v-btn>
</template>
<script>
export default {
	props: {
		borderWidth: {
			type: String,
			default: '12px',
		},
		fontSize: {
			type: String,
			default: '16px',
		},
	},
	computed: {
		tagButtonIconStyle() {
			return {
				fontSize: this.fontSize,
				border: `${this.borderWidth} solid rgba(0, 0, 0, 0.45)`,
			};
		},
	},
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
		border-radius 50%
</style>
