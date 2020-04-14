<template>
	<section class="d-flex text-section accept-section">
		<div class="banner-notification-section">
			<UserLink
				ref="user-link"
				:size="banner ? '6.15vw' : '10.76vw'"
				:user="acceptingUser"
				hide-name
			/>
			<span v-if="banner" class="check-icon">
				<img src="~assets/img/notification-accept.svg">
			</span>
		</div>
		<div class="notification-message">
			<div class="message">
				<span ref="message">
					<UserLink
						:user="acceptingUser"
						hide-avatar
					/>
					{{ banner ? $t('notify.acceptedbanner') : $t('notify.accepted') }}
				</span>
				<span ref="time-string" class="time-string-section">
					<span v-show="!banner" class="time-string">
						{{ timeString }}
					</span>
				</span>
			</div>
		</div>
	</section>
</template>

<script>
import UserLink from '~/components/UserLink';

export default {
	name: 'NotifyAcceptSquad',
	components: {
		UserLink,
	},
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
		timeString () {
			window.moment.locale(this._i18n.locale);
			return window.moment(this.notification.ts).fromNow();
		},
		acceptingUser () {
			return this.notification.user;
		},
	},
};
</script>

<style lang="stylus" scoped>
i.sqdi-checkmark
	margin-top 2px
.time-string
	font-size 2.92vw
	vertical-align middle
	color #B8B8BA
	margin-left 0.6VW
.time-string-section
	margin-top 0
	display block
.notification-message
	width 100%
	cursor pointer
	.message
		padding-right 1.93vw
		display inline-block
		vertical-align top
	span.text-bold
		font-weight 600
.deny-btn
	font-size 0.6em
	font-weight 700
	letter-spacing 1px
	border-radius 10px
.accepted-mark
	font-size 0.6em
	font-weight 700
	letter-spacing 1px
	border-radius 10px
	background-color #F5F5F5 !important
	color white
.feed
	section.text-section.accept-section
		padding 3.07vw 0
		margin 0 4.61vw
		border-left 0
		border-right 0
		&:first-child
			border 0
			padding-top 2vw
		img.in-squad
			width 3.07vw
			height 3.07vw
		.accepted-btn-text
			color #000000
.notifications-container
	.notification-message
		align-self center
		.message
			width 100%
			span
				font-size 3.23vw
				line-height 3.69vw
	.banner-notification-section
		position: relative;
	.check-icon img
		width 4vw
		position absolute
		bottom 0px
		left -2px
</style>
