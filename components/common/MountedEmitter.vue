<template>
	<div>
		<slot />
	</div>
</template>
<script>
export default {
	mounted () {
		this.$emit('mounted');
	},
};
</script>
