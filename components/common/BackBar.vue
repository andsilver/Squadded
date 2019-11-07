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
