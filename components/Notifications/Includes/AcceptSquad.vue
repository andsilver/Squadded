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
				<div v-if="!notification.accepted" ref="invite-actions" class="d-flex my-2">
					<Button ref="accept-btn" class="ma-0 mr-2" @click.native="accept">
						<v-icon x-small>
							sqdi-checkmark
						</v-icon>
						<span class="ml-2">{{ $t('user.invitation.accept') }}</span>
					</Button>
					<v-btn ref="deny-btn" outlined depressed class="deny-btn">
						{{ $t('user.invitation.deny') }}
					</v-btn>
				</div>
				<v-btn v-else ref="accepted-mark" depressed class="mt-2 accepted-mark">
					<v-icon x-small>
						sqdi-checkmark
					</v-icon>
					<span class="ml-2">{{ $t('user.invitation.accepted') }}</span>
				</v-btn>
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
	name: 'NotifyAcceptSquad',
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
		acceptingUser () {
			return this.notification.user;
		},
	},
	methods: {
		accept() {
			const { me } = this.$store.state.user;
			if (!me.nameSelected) {
				this.$router.push('/select-username');
				return;
			}
			this.$ws.sendObj({
				type: 'acceptSquad',
				targetUserId: this.notification.userId,
			});
			this.$store.commit(`${NotificationStore}/${NotificationMutations.setAcceptedSquad}`, this.notification._id);
			this.$forceUpdate();
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
	background-color #fd6256 !important
	color white
</style>
