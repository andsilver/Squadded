<template>
	<v-container>
		<v-layout
			v-if="isVisible"
			column
			justify-center
			align-center
		>
			<div class="full-width">
				Under construction
			</div>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
	computed: {
		...mapState([
			'socket',
		]),
		isVisible () {
			return !this.socket.isPendingAuth && this.socket.isAuth;
		},
	},
	mounted() {
		if (this.socket.isAuth) {
			this.$store.commit('SET_PENDING', false);
		}
	},
};
</script>
