<template>
	<v-btn outlined :disabled="disabled" @click="click">
		<slot />
	</v-btn>
</template>

<script>
export default {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		click() {
			this.$emit('click');
		},
	},
};
</script>

<style lang="scss" scoped>
.v-btn {
	font-size: 0.62em !important;
	border-radius: 10px;
	font-weight: 600;
	border-width: 2px;
}
.invited-button.v-btn {
	height: 9.23vw !important;
	font-size: 2.15vw !important;
	letter-spacing: 1.5px;
	font-weight: 700;
}

</style>
