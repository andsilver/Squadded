<template>
	<section class="d-flex text-section">
		<UserLink
			ref="user-link-avatar"
			size="40"
			:user="votedUser"
			hide-name
		/>
		<div class="notification-message">
			<div class="message">
				<span>
					<UserLink
						ref="user-link-name"
						:user="votedUser"
						hide-avatar
					/>
					{{ $t('notify.vote') }}
					<span ref="post-title" class="text-bold cursor-pointer" @click="goToLandingPost">
						{{ notification.text || $t('notify.post') }}
					</span>
				</span>
				<span ref="timestring" class="time-string-section">
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
			<div class="imgae-section">
				<img
					v-if="notification.type == 'notifVote'"
					ref="notification-image"
					:src="notifImage"
					class="notification-image"
				>
			</div>
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
			return this.notification.voter ? this.notification.voter : this.notification.user;
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
	.message
		width calc(100% - 10.2vw)
		padding-right 1.93vw
		display inline-block
		vertical-align top
	span.text-bold
		font-weight 600
.cursor-pointer
	cursor pointer
</style>
