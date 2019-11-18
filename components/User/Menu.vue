<template>
	<v-menu bottom offset-y>
		<template v-slot:activator="{ on }">
			<v-btn icon class="button_more" :dark="dark" v-on="on">
				<v-icon>
					sqdi-more
				</v-icon>
			</v-btn>
		</template>

		<v-list>
			<v-list-item>
				<v-list-item-title @click="() => $emit('share')">
					{{ $t('user.share') }}
				</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>
export default {
	props: {
		dark: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-btn
	width 40px !important
	height 40px !important
	i
		font-size 1.5em !important
</style>
