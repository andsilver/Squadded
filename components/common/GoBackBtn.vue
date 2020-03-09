<template>
	<v-btn ref="go-back-btn" icon :dark="dark" @click="goBack">
		<v-icon>
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
	},
	computed: {
		...mapState([
			'socket',
		]),
	},
	methods: {
		goBack() {
			if (this.socket.isAuth) {
				history.back();
			} else {
				this.$router.push('/community');
			}
		},
	},
};
</script>
