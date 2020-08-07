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
export default {
	props: {
		selected: {
			type: String,
			default: '',
		},
	},
	data: () => ({
		pane: null,
		colors: [
			{
				background: 'white',
				color: 'black',
				border: 'black',
			},
			{
				background: 'black',
				color: 'white',
				border: 'white',
			},
			{
				background:
					'linear-gradient(225.04014843941147deg, #B22B5B 0%, #FF8177 100%)',
				color: 'white',
				border: 'white',
			},
			{
				background:
					'linear-gradient(225.04014843941147deg, #CF37FF 0%, #4A34A1 100%)',
				color: 'white',
				border: 'white',
			},
			{
				background:
					'linear-gradient(225deg, #0084A7 0%, #1476FF 0%, #2FF2FE 100%)',
				color: 'white',
				border: 'white',
			},
			{
				background: 'linear-gradient(225deg, #FFD244 0%, #FF7E56 100%)',
				color: 'white',
				border: 'white',
			},
			{
				background:
					'linear-gradient(225.04014843941147deg, #ECE0D6 0%, #F6F0ED 100%)',
				color: 'black',
				border: 'black',
			},
			{
				background:
					'linear-gradient(225.43185376937788deg, #FF59DA 0%, #EF36C6 4%, #F651D1 12%, #CE26A8 25%, #D936B4 64%, #E82CBD 79%, #F448CD 84%, #D91EAE 91%, #C2189A 100%)',
				color: 'white',
				border: 'white',
			},
			{
				background:
					'linear-gradient(225deg, #5EAEFB 0%, #83C3FC 13%, #69B2FC 22%, #9556E9 81%, #977AF5 92%, #D7A8FC 100%)',
				color: 'white',
				border: 'white',
			},
			{
				background:
					'linear-gradient(222.47114380273908deg, #1088CD 0%, #02E588 85%, #00AA49 100%)',
				color: 'white',
				border: 'white',
			},
		],
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
