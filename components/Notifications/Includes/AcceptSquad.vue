<template>
	<section class="d-flex text-section">
		<UserLink
			ref="user-link"
			size="40"
			:user="acceptingUser"
			hide-name
		/>
		<div class="notification-message">
			<div class="message">
				<span ref="message">
					<UserLink
						:user="acceptingUser"
						hide-avatar
					/>
					{{ $t('notify.accepted_invite') }}
				</span>
				<span ref="time-string" class="time-string-section">
					<v-avatar color="#000" size="4.923vw">
						<v-icon dark size="2.76vw">
							sqdi-checkmark
						</v-icon>
					</v-avatar>
					<span class="time-string">
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
			return this.notification.acceptingUser;
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
</style>
