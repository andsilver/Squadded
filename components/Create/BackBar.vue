<template>
	<h2>
		<v-btn ref="go-back-btn" icon @click="goBack">
			<v-icon v-if="close">
				mdi-close
			</v-icon>
			<v-icon v-else>
				sqdi-arrow-pointing-to-left
			</v-icon>
		</v-btn>
		{{ title }}
	</h2>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '',
		},
		close: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		goBack() {
			if (!this.close) {
				return this.$router.back();
			}
			const stack = Object.assign([], this.$router.history.stack);
			const route = stack
				.reverse()
				.find(s => !['create-outfit', 'create-poll', 'create-upload', 'create-video'].includes(s.name));

			if (route && route.query.itemId) {
				return this.$router.push(route);
			} else {
				return this.$router.push('/feed');
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
h2 {
	color: #000;
	font-size: 4.307vw;
	font-weight: bold;
	text-align: center;
	padding-bottom: 0px;
	position: relative;
	line-height: 36px;

	button {
		position: absolute;
		left: 0;
	}
}
</style>
