<template>
	<section>
		<label>{{ $t('poll.expiration') }}</label>
		<v-row>
			<Button
				v-for="(due, index) in options"
				:key="due"
				:active="selected === index"
				@click.native="() => switchDate(index)"
			>
				{{ $t(`expiration._${due}`) }}
			</Button>
		</v-row>
	</section>
</template>

<script>
import Button from '~/components/common/Button';
export default {
	components: {
		Button,
	},
	data: () => ({
		selected: 2,
		options: ['15m', '1h', '1d', '3d', '7d'],
	}),
	computed: {
		date () {
			const m = window.moment();
			const amount = parseInt(this.options[this.selected], 10);
			const interval = this.options[this.selected].slice(-1);
			return m.add(amount, interval).valueOf();
		},
	},
	methods: {
		switchDate (i) {
			this.selected = i;
		},
	},
};
</script>

<style lang="stylus" scoped>

</style>
