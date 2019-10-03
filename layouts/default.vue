<template>
	<v-app>
		<v-content :class="{ flex: socket.isPendingAuth }">
			<logo />
			<v-container :class="{ flex: socket.isPendingAuth }">
				<nuxt ref="main-content" />
				<!-- <div v-else-if="merchant.forbidden">
					{{ $t('Forbidden') }}
				</div> -->
				<Preloader v-if="socket.isPendingAuth"  ref="preloader" />
			</v-container>
		</v-content>
	</v-app>
</template>

<style lang="stylus">
.v-content.flex .v-content__wrap,
.container.flex
	display flex
	flex-direction column
</style>

<script>
import { mapState } from 'vuex';
import Logo from '~/components/Logo.vue';
import Preloader from '~/components/Preloader.vue';

export default {
	components: {
		Logo,
		Preloader,
	},
	data: () => ({
		title: 'Squad Widget',
	}),
	computed: {
		...mapState([
			'socket',
		]),
	},
};
</script>
