<template lang="html">

	<section class="feed">
		<h1>{{ message }}</h1>
	</section>

</template>

<script lang="js">
	export default  {
		name: 'feed',
		props: [],
		mounted() {

		},
		data() {
			return {
				message: 'hello!'
			}
		},
		methods: {

		},
		computed: {

		},
		created () {
			this.message = 'bye!';
		}
}
</script>

<style scoped lang="scss">
	.feed {

	}
</style>
