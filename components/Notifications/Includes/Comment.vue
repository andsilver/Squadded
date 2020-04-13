<template>
	<section class="d-flex text-section">
		<UserLink
			:size="banner ? '6.15vw' : '40'"
			:user="notification.user"
			hide-name
		/>
		<div class="notification-message" @click="goToLandingPost">
			<div class="message" :class="{ is_poll: notification.post.type == 'pollPost' }">
				<span>
					<span class="user_name">
						{{ notification.user.screenName }}
					</span>
					{{ banner ? $t('notify.justcommented') : $t('notify.commentedq') }}
					{{ banner && notification.post.type == 'pollPost' ? $t('YourPoll') : '' }}
					{{ banner && notification.post.type == 'singleItemPost' ? $t('YourItem') : '' }}
					{{ banner && notification.post.type == 'galleryPost' ? $t('YourPicture') : '' }}
					{{ banner && notification.post.type == 'outfitPost' ? $t('YourOutfit') : '' }}
					<span v-if="!banner">
						{{ notification.text || $t('notify.post') }}
					</span>
				</span>
				<span v-if="!banner" class="time-string-section">
					<v-avatar color="#000" size="4.923vw">
						<v-icon dark class="notify-comments" size="2.76vw" />
					</v-avatar>
					<span class="time-string">
						{{ timeString }}
					</span>
				</span>
			</div>
			<div v-if="!banner" class="imgae-section">
				<img v-if="notification.post.type == 'singleItemPost'" :src="notification.post.item.img" class="notification-image">
				<img v-if="notification.post.type == 'galleryPost'" :src="notification.post.img" class="notification-image">
				<img v-if="notification.post.type == 'outfitPost'" :src="notification.post.items[0].img" class="notification-image">
				<span v-if="notification.post.type == 'outfitPost'" class="item-mast-count">+{{ (notification.post.items.length - 1) }}</span>
				<span v-if="notification.post.type == 'pollPost'" class="poll-images">
					<img v-if="notification.post.type == 'pollPost'" :src="notification.post.item1.img" class="notification-image">
					<img v-if="notification.post.type == 'pollPost'" :src="notification.post.item2.img" class="notification-image">
					<span class="poll-icon">
						<img src="~assets/img/poll-arrows.svg" class="poll-image">
					</span>
				</span>
			</div>
		</div>
	</section>
</template>

<script>
import UserLink from '~/components/UserLink';

export default {
	name: 'NotifyComment',
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
	},
	methods: {
		goToLandingPost() {
			this.$router.push(`/post/${this.notification.post.guid}#comments`);
		},
	},
};
</script>

<style lang="stylus" scoped>
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
	span.poll-images
		width 18.95vw
		display flex
		vertical-align middle
		img.notification-image
			&:first-child
				margin-right 0.4vw
		span.poll-icon
			width 4.29vw
			height 4.29vw
			background-color #000
			border-radius 50%
			display flex
			justify-content center
			left 40%
			top 30%
			position absolute
			border 0.6vw solid #f5f5f5
			img.poll-image
				width 2vw
				margin-left 0.1vw
.notification-message
	width 100%
	cursor pointer
	.message
		width calc(100% - 10.2vw)
		padding-right 1.93vw
		display inline-block
		vertical-align top
		&.is_poll
			width calc(100% - 19.9vw)
	span.text-bold
		font-weight 600
.notify-comments
	background-image url('~assets/img/notify-comment.svg') !important
	background-repeat no-repeat !important
	background-size 2.6vw !important
	background-position center !important
.notifications-container
	.notification-message
		align-self center
		.message
			width 100%
			span
				font-size 3.23vw
				line-height 3.69vw
.user_name
	font-size 3.23vw
	font-weight 600
	line-height 4vw
</style>
