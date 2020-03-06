<template>
	<input
		ref="input"
		v-model="model"
		type="number"
		min="0"
		max="9"
		:class="{ invalid }"
		:autocomplete="false"
		@input="handleOnChange"
		@keydown="handleOnKeyDown"
		@paste="handleOnPaste"
		@focus="handleOnFocus"
		@blur="handleOnBlur"
	>
</template>

<script>
export default {
	name: 'Digit',
	props: {
		value: {
			type: String,
			default: null,
		},
		focus: {
			type: Boolean,
		},
		isLastChild: {
			type: Boolean,
		},
		invalid: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			model: this.value || '',
		};
	},
	watch: {
		value(newValue, oldValue) {
			if (newValue !== oldValue) {
				this.model = newValue;
			}
		},
		focus(newFocusValue, oldFocusValue) {
			if (oldFocusValue !== newFocusValue && this.$refs.input && this.focus) {
				this.$refs.input.focus();
			}
		},
	},
	mounted() {
		if (this.$refs.input && this.focus) {
			this.$refs.input.focus();
		}
	},
	methods: {
		handleOnChange() {
			if (this.model.length > 1) {
				this.model = this.model.slice(0, 1);
			}
			return this.$emit('change', this.model);
		},
		handleOnKeyDown(event) {
			const keyevent = event || window.event;
			const charCode = keyevent.which ? keyevent.which : keyevent.keyCode;
			if ((event.code || event.key) === 'Enter') {
				this.$emit('enter');
			}
			if ((charCode >= 48 && charCode <= 57) ||
				charCode === 8 ||
				charCode === 86 ||
				charCode === 46 ||
				charCode === 37 ||
				charCode === 39
			) {
				this.$emit('keydown', event);
			} else {
				keyevent.preventDefault();
			}
		},
		handleOnPaste(event) {
			return this.$emit('paste', event);
		},
		handleOnFocus() {
			this.$refs.input.select();
			return this.$emit('focus');
		},
		handleOnBlur() {
			return this.$emit('blur');
		},
	},
};
</script>
<style lang="stylus" scoped>
input
	font-size 3.69vw
	color #000000
	line-height 4.92vw
	text-align center
	margin-top 2px
	height 10.79vw
	border-bottom 0.3vw solid #707070
	border-radius 0
	font-size: 6.46vw;
	font-weight 400
	margin-bottom 3.15vw
	width 9.69vw
	&.mr-pin
		margin-right 4.15vw
	&.invalid
		color #FD6256
	&:focus
		outline none
</style>
