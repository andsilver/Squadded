<template>
	<button>
		<img :src="src" alt="Facebook logo button">
	</button>
</template>

<script>
export default {
	props: {
		for: {
			type: String,
			default: 'fb',
		}
	},
	data: function () {
		return {
			src: `/img/${this.for}-btn.svg`
		}
	}
}
</script>
