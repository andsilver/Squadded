<template>
	<section class="d-flex align-center">
		<div class="pa-2">
			<v-icon color="#FD6256">
				sqdi-checkmark
			</v-icon>
		</div>
		<div class="d-flex flex-column justify-center">
			<span>{{ notification.text }}</span>
			<span v-if="!banner">
				<v-avatar color="#000" size="24px">
					<v-icon dark size="16">sqdi-chat-outlined</v-icon>
				</v-avatar>
				{{ timeString }}
			</span>
		</div>
		<v-btn outlined>
			{{ $t('Undo') }}
		</v-btn>
	</section>
</template>

<script>
export default {
	name: 'NotifyAlert',
	props: {
		notification: {
			type: Object,
			required: true,
		},
		banner: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		timeString() {
			window.moment.locale(this._i18n.locale);
			return window.moment(this.notification.ts).fromNow();
		},
	},
};
</script>

<style lang="stylus" scoped></style>
