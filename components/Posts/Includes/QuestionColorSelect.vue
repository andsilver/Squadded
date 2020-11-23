<template>
	<div class="question-colors">
		<v-card
			v-for="(color, index) in colors"
			ref="color"
			:key="index"
			:style="{
				background: color.background,
				border: color.background === pane.background ? `1.5px solid ${color.border}` : 'unset'
			}"
			class="question-color"
			hover
			@click="() => onSelect(color)"
		/>
	</div>
</template>

<script>
import { QUESTION_COLORS } from '~/consts';

export default {
	props: {
		selected: {
			type: String,
			default: '',
		},
	},
	data: () => ({
		pane: null,
		colors: QUESTION_COLORS,
	}),
	created() {
		this.pane = this.colors.find(c => c.background === this.selected);
	},
	methods: {
		onSelect(pane) {
			this.pane = pane;
			this.$emit('select', pane);
		},
	},
};
</script>

<style lang="scss" scoped>
.question-colors {
	display: -webkit-inline-box;
	display: -moz-inline-box;
	overflow-x: auto;
	padding: 16px 0;

	.question-color {
		margin-right: 8px;
		height: 32px;
		width: 32px;
		transition: border linear 0.1s;

		&:last-of-type {
			margin-right: 0;
		}
	}

	&::-webkit-scrollbar {
		height: 3px;
		border-radius: 3px;
	}

	&::-webkit-scrollbar-track {
		background-color: rgba(0, 0, 0, 0.1);
	}

	&::-webkit-scrollbar-thumb {
		background-color: gray;
	}
}
</style>
