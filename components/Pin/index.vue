<template>
	<div class="pin">
		<Digit
			v-for="(item, i) in numInputs"
			:key="i"
			:focus="activeInput === i"
			:value="otp[i]"
			:is-last-child="i === numInputs - 1"
			:invalid="invalid"
			:class="{ 'mr-pin': i !== numInputs - 1 }"
			@change="handleOnChange"
			@keydown="handleOnKeyDown"
			@paste="handleOnPaste"
			@focus="handleOnFocus(i)"
			@blur="handleOnBlur"
			@enter="$emit('enter')"
		/>
	</div>
</template>

<script>
import Digit from './Digit';

const BACKSPACE = 8;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const DELETE = 46;

export default {
	name: 'OtpInput',
	components: {
		Digit,
	},
	props: {
		numInputs: {
			type: Number,
			default: 4,
		},
		invalid: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		activeInput: 0,
		otp: [],
		oldOtp: [],
	}),
	methods: {
		handleOnFocus(index) {
			this.activeInput = index;
		},
		handleOnBlur() {
			this.activeInput = -1;
		},
		checkFilledAllInputs() {
			if (this.otp.join('').length === this.numInputs) {
				return this.$emit('complete', this.otp.join(''));
			}
			return 'Wait until the user enters the required number of characters';
		},
		focusInput(input) {
			this.activeInput = Math.max(Math.min(this.numInputs - 1, input), 0);
		},
		focusNextInput() {
			this.focusInput(this.activeInput + 1);
		},
		focusPrevInput() {
			this.focusInput(this.activeInput - 1);
		},
		changeCodeAtFocus(value) {
			this.oldOtp = Object.assign([], this.otp);
			this.$set(this.otp, this.activeInput, value);
			if (this.oldOtp.join('') !== this.otp.join('')) {
				this.$emit('change', this.otp.join(''));
				this.checkFilledAllInputs();
			}
		},
		handleOnPaste(event) {
			event.preventDefault();
			const pastedData = event.clipboardData
				.getData('text/plain')
				.slice(0, this.numInputs - this.activeInput)
				.split('');
			if (this.isInputNum && !pastedData.join('').match(/^\d+$/)) {
				return 'Invalid pasted data';
			}
			const currentCharsInOtp = this.otp.slice(0, this.activeInput);
			const combinedWithPastedData = currentCharsInOtp.concat(pastedData);
			this.$set(this, 'otp', combinedWithPastedData.slice(0, this.numInputs));
			this.focusInput(combinedWithPastedData.slice(0, this.numInputs).length);
			return this.checkFilledAllInputs();
		},
		handleOnChange(value) {
			this.changeCodeAtFocus(value);
			this.focusNextInput();
		},
		clearInput() {
			if (this.otp.length > 0) {
				this.$emit('change', '');
			}
			this.otp = [];
			this.activeInput = 0;
		},
		handleOnKeyDown(event) {
			switch (event.keyCode) {
			case BACKSPACE:
				event.preventDefault();
				this.changeCodeAtFocus('');
				this.focusPrevInput();
				break;
			case DELETE:
				event.preventDefault();
				this.changeCodeAtFocus('');
				break;
			case LEFT_ARROW:
				event.preventDefault();
				this.focusPrevInput();
				break;
			case RIGHT_ARROW:
				event.preventDefault();
				this.focusNextInput();
				break;
			default:
				break;
			}
		},
	},
};
</script>
<style lang="stylus" scoped>
.pin
	display flex
	justify-content center
</style>
