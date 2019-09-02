<template>
	<v-app>
		<v-content :class="{ flex: !merchant.id }">
			<logo />
			<v-container :class="{ flex: !merchant.id }">
				<nuxt v-if="merchant.id" />
				<div v-else-if="merchant.forbidden">
					{{ $t('Forbidden') }}
				</div>
				<div v-else class="suspense">
					<v-progress-circular
						color="primary"
						size="150"
						indeterminate
						class="progress"
					/>
				</div>
			</v-container>
		</v-content>
	</v-app>
</template>

<style lang="stylus">
.v-content.flex .v-content__wrap,
.container.flex
	display flex
	flex-direction column

.suspense
	display flex
	flex-grow 1

	.progress
		margin auto

</style>

<script>
import { mapState } from 'vuex';
import Logo from '~/components/Logo.vue';

export default {
	components: {
		Logo,
	},
	data() {
		return {
			title: 'Squad Widget',
		};
	},
	computed: {
		...mapState([
			'merchant',
		]),
	},
};
</script>
