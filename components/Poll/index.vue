<template>
	<section class="poll-post grid my-3">
		<PollItem
			v-if="item1"
			ref="poll-item1"
			:item="item1"
		/>
		<SelectItem v-else />
		<PollItem
			v-if="item2"
			ref="poll-item2"
			:item="item2"
		/>
		<SelectItem v-else />
	</section>
</template>

<script>
import SelectItem from './SelectItem';
import PollItem from '~/components/Posts/Includes/PollItem';

export default {
	components: {
		SelectItem,
		PollItem,
	},
	props: {
		item1: {
			type: Object,
			default: null,
		},
		item2: {
			type: Object,
			default: null,
		},
	},
};
</script>

<style lang="stylus" scoped>
.grid
	grid-template-columns 1fr 1fr
	grid-gap 20px
</style>
