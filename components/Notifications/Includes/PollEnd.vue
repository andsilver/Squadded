<template>
	<section class="d-flex">
		<v-avatar>
			<v-icon size="24px">
				sqdi-squadded-icon
			</v-icon>
		</v-avatar>
		<div class="d-flex flex-column">
			<span>
				&nbsp;{{ $t('notify.pollend') }}
			</span>
			<span>
				{{ timeString }}
			</span>
		</div>
	</section>
</template>

<script>

export default {
	name: 'PollEnd',
	components: {
	},
	props: {
		notification: {
			type: Object,
			required: true,
		},
	},
	computed: {
		timeString () {
			window.moment.locale(this._i18n.locale);
			return window.moment(this.notification.ts).fromNow();
		},
	},
};
</script>

<style lang="stylus" scoped>
</style>
