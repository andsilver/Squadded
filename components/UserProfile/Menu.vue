<template>
	<v-menu :attach="parentNode" bottom offset-y>
		<template v-slot:activator="{ on }">
			<v-btn
				icon
				class="button_more"
				:dark="dark"
				:small="small"
				v-on="on"
				@click="() => $emit('edit')"
			>
				<v-icon :small="small">
					sqdi-more
				</v-icon>
			</v-btn>
		</template>
	</v-menu>
</template>

<script>
export default {
	props: {
		dark: {
			type: Boolean,
			default: false,
		},
		small: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		parentNode: null,
	}),
	mounted() {
		this.parentNode = this.$parent.$el;
	},
};
</script>
<style lang="stylus" scoped>
.button_more
	.sqdi-more
		font-size 5.1vw !important
		color #B8B8BA
</style>
