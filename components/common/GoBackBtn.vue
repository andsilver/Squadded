<template>
	<v-btn ref="go-back-btn" icon :dark="dark" @click="goBack">
		<v-icon v-if="close">
			mdi-close
		</v-icon>
		<v-icon v-else>
			sqdi-arrow-pointing-to-left
		</v-icon>
	</v-btn>
</template>

<script>
import { mapState } from 'vuex';

export default {
	props: {
		dark: {
			type: Boolean,
			default: false,
		},
		close: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		...mapState([
			'socket',
		]),
	},
	methods: {
		goBack() {
			if (this.close) {
				const beforeCreatePath = sessionStorage.getItem('beforeCreatePath');
				if (beforeCreatePath) {
					sessionStorage.removeItem('beforeCreatePath');
					return this.$router.push(beforeCreatePath);
				}
			}
			if (this.socket.isAuth) {
				const stack = [...this.$router.history.stack];
				const routeIndex = stack.reverse().findIndex(s => s.path !== this.$router.history.current.path);

				if (routeIndex > 0) {
					return this.$router.go(-routeIndex);
				}
				this.$router.back();
			} else {
				this.$router.push('/community');
			}
		},
	},
};
</script>
