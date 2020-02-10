<template>
	<section class="d-flex text-section">
		<UserLink
			ref="user-link"
			size="40"
			:user="user"
			hide-name
		/>
		<div class="notification-message">
			<div class="message">
				<span ref="message">
					<UserLink
						:user="user"
						hide-avatar
					/>
					{{ $t('notify.follow') }}
				</span>
				<div ref="time-string" class="time-string-section">
					<span class="time-string">
						{{ timeString }}
					</span>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import UserLink from '~/components/UserLink';

export default {
	name: 'NotifyFollowRequest',
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
		user () {
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
	margin-top 0.6VW
	display block
.notification-message
	width 100%
	.message
		width calc(100% - 10.2vw)
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
	background-color #fd6256 !important
	color white
</style>
