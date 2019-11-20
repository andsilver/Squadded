<template>
	<span v-if="value" class="badge">{{ short }}</span>
</template>

<script>
import { shortNumber } from '~/helpers';

export default {
	props: {
		value: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		short () {
			return shortNumber(this.value, this._i18n.locale);
		},
	},
};
</script>

<style lang="stylus" scoped>
.badge
	position absolute
	font-size .7em
	font-weight 600
	line-height 14px
	color #fff
	background-color #FD6256
	border-radius 7px
	min-width 14px
	padding 0 4px
</style>
