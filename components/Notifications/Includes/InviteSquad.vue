<template>
	<section class="d-flex text-section accept-section">
		<UserLink
			ref="user-link"
			size="10.76vw"
			:user="invitingUser"
			hide-name
		/>
		<div class="notification-message">
			<div class="message">
				<span ref="message">
					<UserLink
						:user="invitingUser"
						hide-avatar
					/>
					{{ $t('notify.invited') }}
				</span>
				<div ref="invite-actions" class="d-flex my-2">
					<Button ref="accept-btn" class="ma-0 mr-2" @click.native="accept">
						<v-icon x-small>
							sqdi-checkmark
						</v-icon>
						<span class="ml-2">{{ $t('user.invitation.accept') }}</span>
					</Button>
					<v-btn ref="deny-btn" outlined depressed class="deny-btn" @click="deny">
						{{ $t('user.invitation.deny') }}
					</v-btn>
				</div>
				<span ref="time-string" class="time-string-section">
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
import Button from '~/components/common/Button';
import { NotificationStore, NotificationMutations } from '~/store/notification';

export default {
	name: 'NotifyInviteSquad',
	components: {
		UserLink,
		Button,
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
		invitingUser () {
			return this.notification.user;
		},
	},
	methods: {
		accept() {
			const { me } = this.$store.state.user;
			if (!me.nameSelected) {
				return this.$router.push('/select-username');
			}
			this.$ws.sendObj({
				type: 'acceptSquad',
				targetUserId: this.notification.userId,
			});
			this.$ws.sendObj({
				type: 'deleteNotification',
				guid: this.notification._id,
			});
			this.$forceUpdate();
			this.$store.commit(`${NotificationStore}/${NotificationMutations.setAcceptedSquad}`, this.notification._id);
		},
		deny() {
			this.$ws.sendObj({
				type: 'inviteSquad',
				targetUserId: this.notification.userId,
				denied: true,
			});
			this.$ws.sendObj({
				type: 'deleteNotification',
				guid: this.notification._id,
			});
			this.$store.commit(`${NotificationStore}/${NotificationMutations.setAcceptedSquad}`, this.notification._id);
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
</style>
