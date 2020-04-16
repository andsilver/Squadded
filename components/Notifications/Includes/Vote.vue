<template>
	<section class="d-flex text-section align-center">
		<UserLink
			ref="user-link-avatar"
			:size="banner ? '6.15vw' : '40'"
			:user="votedUser"
			hide-name
		/>
		<div class="notification-message" @click="goToLandingPost">
			<div class="message">
				<span>
					<span ref="user-link-name" class="user_name">
						{{ votedUser.screenName }}
					</span>
					{{ $t('notify.vote') }}
					<span ref="post-title" class="text-bold cursor-pointer">
						{{ notification.text || $t('notify.poll') }}
					</span>
				</span>
				<span v-if="!banner" ref="timestring" class="time-string-section">
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
		<div v-if="!banner" class="imgae-section">
			<img
				v-if="notification.type == 'notifVote'"
				ref="notification-image"
				:src="notifImage"
				class="notification-image"
			>
		</div>
	</section>
</template>

<script>
import UserLink from '~/components/UserLink';

export default {
	name: 'NotifyLike',
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
		notifImage () {
			return this.notification.vote === 1 ? this.notification.item1.img : this.notification.item2.img;
		},
		votedUser () {
			return this.notification.voter;
		},
	},
	methods: {
		goToLandingPost() {
			this.$router.push(`/post/${this.notification.guid}`);
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
.imgae-section
	display inline-block
	position relative
	span.item-mast-count
		position: absolute
		top 0px
		left 0px
		width 100%
		height 100%
		z-index 1
		background-color rgba(0,0,0,0.40)
		color #fff
		font-size 4VW
		font-weight 500
		text-align center
		padding-top 30%
	.notification-image
		width 9.230vw
		max-height 13.38vw
.notification-message
	width 100%
	cursor pointer
	.message
		padding-right 1.93vw
		display inline-block
		vertical-align top
	span.text-bold
		font-weight 600
.cursor-pointer
	cursor pointer
.user_name
	font-size 3.23vw
	font-weight 600
	line-height 4vw
.notifications-container
	.notification-message
		align-self center
		.message
			width 100%
			span
				font-size 3.23vw
				line-height 3.69vw
	span.text-bold
		font-weight 400
</style>
