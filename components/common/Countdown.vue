<template>
	<div class="ending">
		{{ $t('explore_page.ending_polls.ending_in') }} <span v-if="days"><em>{{ days }}</em>d</span> <span v-if="hours > 0"><em>{{ hours }}</em>h</span> <span><em>{{ minutes }}</em>m</span> <span><em>{{ seconds }}</em>s</span>
	</div>
</template>

<script>

export default {
	props: {
		timeStamp: {
			type: Number,
			default: 0,
		},
	},
	data: () => ({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	}),
	created () {
		this.countDownTimers();
	},
	methods: {
		countDownTimers() {
			setTimeout(() => {
				this.days = window.moment(this.timeStamp).diff(window.moment(), 'days');
				this.hours = window.moment.utc(window.moment(this.timeStamp).diff(window.moment())).format('HH');
				this.minutes = window.moment.utc(window.moment(this.timeStamp).diff(window.moment())).format('mm');
				this.seconds = window.moment.utc(window.moment(this.timeStamp).diff(window.moment())).format('ss');
				this.countDownTimers();
			}, 1000);
		},
	},
};
</script>

<style lang="stylus" scoped>
.ending
	margin 0 0 0px 7px
em
	color: #FD6256
	font-style normal
</style>
