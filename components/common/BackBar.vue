<template>
	<h2>
		<GoBackBtn />
		{{ title }}
	</h2>
</template>

<script>
import GoBackBtn from '~/components/common/GoBackBtn';

export default {
	components: {
		GoBackBtn,
	},
	props: {
		title: {
			type: String,
			default: '',
		},
	},
};
</script>
<style lang="css" scoped>
	.titlebar button {
		position: absolute;
		left: 0;
	}
</style>
