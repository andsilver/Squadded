<template>
	<section>
		<SelectItems ref="select-items" :max-count="max" />
		<BottomFixed>
			<p v-if="showLimitError" class="tip-note error-note">
				{{ $t('tip.selectLimitError', { min, max }) }}
			</p>
			<SelectedItems ref="selected-items" />
			<NextButton
				:disabled="!complete"
				@click.native="next"
			/>
		</BottomFixed>
	</section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import BottomFixed from '~/components/Create/BottomFixed';
import NextButton from '~/components/Create/NextButton';
import SelectItems from '~/components/Create/SelectItems';
import SelectedItems from '~/components/Create/SelectedItems';
import { ActivityStore, ActivityGetters } from '~/store/activity';

const { mapGetters } = createNamespacedHelpers(ActivityStore);

export default {
	components: {
		BottomFixed,
		NextButton,
		SelectItems,
		SelectedItems,
	},
	props: {
		max: {
			type: Number,
			default: 2,
		},
		min: {
			type: Number,
			default: 1,
		},
	},
	data: () => ({
		showLimitError: false,
	}),
	computed: {
		...mapGetters([
			ActivityGetters.getSelected,
		]),
		complete () {
			return !!(this.getSelected.length >= this.min && this.getSelected.length <= this.max);
		},
	},
	created () {
		this.$root.$on('selectProducts', (limitError) => {
			this.showLimitError = limitError || !this.complete;
		});
	},
	methods: {
		next() {
			this.$emit('next');
		},
	},
};
</script>

<style lang="stylus" scoped>
.tip-note
	font-size 3.384vw
	font-weight 600
	margin-bottom 0
	margin-top 8px
	text-align center
	&.error-note
		color #FD6256
</style>
