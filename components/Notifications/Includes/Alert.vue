<template>
	<section class="d-flex align-center">
		<div class="notification-icon">
			<v-icon size="2.34vw" color="#FFFFFF">
				sqdi-checkmark
			</v-icon>
		</div>
		<div class="d-flex flex-column justify-center">
			<span class="notification-text">{{ notification.text }}</span>
			<span v-if="!banner">
				<v-avatar color="#000" size="24px">
					<v-icon dark size="16">sqdi-chat-outlined</v-icon>
				</v-avatar>
				{{ timeString }}
			</span>
		</div>
		<v-btn outlined class="undo-btn">
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

<style lang="stylus" scoped>
.undo-btn
	width 14.15vw
	height 9.23vw !important
	margin 0 2.07vw
	border 1px solid #000
	border-radius 2.30vw
	font-size 2.5vw
	font-weight 700
	letter-spacing 1.5px
.notification-text
	font-size 3.230vw
	color #000
.notification-icon
	padding 0 1.9vw
	height 6.15vw
	margin-right 2.13vw
	background-color #FD6256
	border-radius 50%
	text-align center
</style>
