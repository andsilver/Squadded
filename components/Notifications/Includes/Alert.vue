<template>
	<section class="d-flex align-center">
		<div ref="notification-image" class="notification-icon" :class="{ hasIconImage: notification.alertType}">
			<v-icon v-if="notification.alertType === 'invite_sent' || notification.alertType === 'checkmark' || !notification.alertType" size="2.34vw" color="#FFFFFF">
				sqdi-checkmark
			</v-icon>
			<span
				v-if="notification.alertType"
				class="notification-image"
				:class="{
					setprivate: notification.alertType == 'setprivate',
					setpublic: notification.alertType=='setpublic'
				}"
			/>
		</div>
		<div class="d-flex flex-column justify-center">
			<span ref="notification-text" class="notification-text">{{ notification.text }}</span>
			<span v-if="!banner">
				<v-avatar color="#000" size="24px">
					<v-icon dark size="16">sqdi-chat-outlined</v-icon>
				</v-avatar>
				{{ timeString }}
			</span>
		</div>
		<v-btn v-if="notification.alertType !== 'invite_sent'" ref="undo-btn" outlined class="undo-btn pr-2 pl-2" @click="undo">
			{{ $t('Undo') }}
		</v-btn>
	</section>
</template>

<script>
import { NotificationStore, NotificationMutations } from '~/store/notification';

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
	methods: {
		undo () {
			let msg;

			if (this.notification.alertType === 'setpublic' || this.notification.alertType === 'setprivate') {
				msg = {
					type: 'privacy',
					postId: this.notification.post.postId,
				};
			} else if (this.notification.post) {
				msg = {
					type: 'post',
					postId: this.notification.post.postId,
				};
			} else if (this.notification.comment) {
				msg = {
					type: 'comment',
					commentId: this.notification.comment._id,
				};
			} else {
				return;
			}

			this.$store.commit(`${NotificationStore}/${NotificationMutations.undo}`, {
				_id: this.notification._id,
				...msg,
			});
		},
	},
};
</script>

<style lang="stylus" scoped>
.undo-btn
	height 9.23vw !important
	margin 0 2.07vw 0
	border 1px solid #000
	border-radius 2.30vw
	font-size 2.5vw
	font-weight 700
	letter-spacing 1.5px
.notification-text
	font-size 3.230vw
	color #000
	width 52vw
.notification-icon
	padding 0 1.9vw
	height 6.15vw
	margin-right 2.13vw
	background-color #FD6256
	border-radius 50%
	text-align center
	&.hasIconImage
		padding 0 1.6vw
		.notification-image
			height 6.15vw
			display block
			width 3.07vw
			background-size contain
			background-position center
			&.setprivate
				background-image url('~assets/img/notification-private.svg')
			&.setpublic
				background-image url('~assets/img/notification-public.svg')
</style>
