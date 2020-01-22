<template>
	<PopMenu :user="user" />
</template>

<script>
import PopMenu from './PopMenu';

export default {
	components: {
		PopMenu,
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style lang="stylus" scoped></style>
