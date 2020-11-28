<template>
	<div v-if="user" ref="user-link" style="cursor: pointer" @click="navigate">
		<v-list-item v-if="!hideAvatar" class="pa-0 user_link_header">
			<v-list-item-avatar class="mr-3" :size="size">
				<img
					v-if="!isError && user && (user.miniAvatar || user.avatar)"
					:src="user.miniAvatar || user.avatar"
					:alt="user.screenName"
					@error="isError = true"
				>
				<img v-else ref="user-avatar" class="dummy_image pa-1" src="~assets/img/dummy_avater.svg">
				<div
					v-if="showPopover"
					ref="popover"
					class="pop-over"
				>
					<div class="pop-over-content">
						<strong>{{ $t('user.Follow') }}</strong> {{ $t('user.watch_users_you_like') }}
					</div>
				</div>
			</v-list-item-avatar>
			<v-list-item-content v-if="!hideName">
				<v-list-item-title class="user_name">
					<span class="user-screenname">{{ (user.screenName || user.name || '') + ' ' + (user.guest && user.isMe ? $t('you') : '') }}</span>
					<div class="squad-username">
						{{ user.name || 'Name' }}
					</div>
					<div v-if="showScreenName && (user.screenName || user.name)" class="invite-user-screenname" style="color: #b8b8ba">
						{{ user.screenName || user.name }}
					</div>
				</v-list-item-title>
				<v-list-item-subtitle v-if="ts" class="user_timestamp">
					{{ timeString }}
				</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>
		<span v-else class="user_name">
			{{ user.screenName }}
		</span>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { UserStore } from '~/store/user';
import { HomeStore, HomeMutations } from '~/store/home';
import { isAuth, isGuest } from '~/utils/isAuth';
import { ROOT_EVENTS } from '~/consts';

const { mapState } = createNamespacedHelpers(UserStore);

export default {
	name: 'UserLink',
	props: {
		hideAvatar: {
			type: Boolean,
			default: false,
		},
		hideName: {
			type: Boolean,
			default: false,
		},
		size: {
			type: String,
			default: '40',
		},
		ts: {
			type: Number,
			default: 0,
		},
		user: {
			type: Object,
			required: true,
		},
		showScreenName: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		isError: false,
		showPopover: false,
	}),
	computed: {
		...mapState([
			'me',
		]),
		timeString () {
			window.moment.locale(this._i18n.locale);
			const isNewPost = this.ts === Number.MAX_SAFE_INTEGER;
			return isNewPost ? this.$t('post.sending') : this.ts && window.moment(this.ts).fromNow();
		},
		sizeValue () {
			return parseFloat(this.size);
		},
		sizeLength () {
			const match = this.size.match(/[^\d]+$/);
			return (match && match[0]) || 'px';
		},
	},
	mounted() {
		if (!this.user) {
			return;
		}
		this.showPopover = !!this.user.showPopover;

		if (this.showPopover) {
			document.addEventListener('click', () => {
				this.showPopover = false;
				this.$store.commit(`${HomeStore}/${HomeMutations.hidePopover}`);
			}, true);
		}
	},
	methods: {
		navigate() {
			if (!isAuth(this.$store) || isGuest(this.$store)) {
				return this.$root.$emit(ROOT_EVENTS.SHOW_SIGNIN_DIALOG, true);
			}
			const userId = (this.user.guid || this.user.userId);
			const route = (userId === this.me.userId ? { name: 'me' }
				: { name: 'user-id', params: { id: userId } }
			);
			this.$router.push(route);
		},
	},
};
</script>

<style lang="stylus" scoped>
.follow
	position absolute
	right -20%
	bottom -20%
	background-color #000 !important
	border-width 2px
	min-width 0
	min-height 0
	.v-icon
		height auto
		width auto
		min-width 0
		min-height 0
.following
	background-color #b8b8ba !important
.user_name
	font-size 3.23vw
	font-weight 600
	line-height 4vw
.user_timestamp
	font-size 3.230vw
	font-weight 400
.user_link_header
	position relative
	background transparent
.user-section
	.user_link_header
		background-color transparent
	.user_name
		display none
.message-user-image
	.user_link_header
		background-color transparent
	.v-list-item__avatar
		margin-bottom 0px
		margin-top 0px
		margin-left 4px
		margin-right 0px !important
.comment
	.comment_user_name
		font-weight 600
	.v-list-item__avatar
		margin-top 0.46vw
		margin-bottom 0
.nofification-layout
	.v-list-item__avatar
		margin-top 0.46vw
	.user_name
		font-size 3.38vw
.post_user_link
	.v-avatar
		overflow visible
	.v-list-item__avatar
		margin-top 0
		margin-bottom 0
	.v-list-item__content
		padding 0
.notifications-container
	.user_name
		font-size 3.23vw
		line-height 3.69vw
.pop-over
	position absolute
	box-shadow 0px 3px 16px 0px #00000036
	z-index 300
	left 70px
	top 2px
	border-radius: 16px;
	pointer-events none
	&-content
		width 207px
		background #fff
		border-radius 16px
		color black
		text-transform none
		padding 12px 16px
		text-align left
		font-size 14px
		line-height 20px
		font-weight 500
		&:after
			margin-bottom -20px
			content ''
			border 15px solid transparent;
			border-right-color #ffffff
			border-left 0
			position absolute
			left -11px
			top 44%
			margin-top -20px
.highlight
	box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.4), 0 0 0 13px rgba(255, 255, 255, 0.2) !important
	z-index 300
.squad-username
	display none
.my-squad
	.v-list-item__avatar
		margin-top 3VW
		margin-bottom 3VW
	.user-screenname
		font-weight 600
		font-size 4VW
		margin-bottom 0.95vw
	div.squad-username
		display block
		color #B8B8BA
		font-weight 500
	div.squad-username:before
		content '@'
.add-friends-dialog, .signin-process
	.user-screenname
		font-size: 4VW;
	.invite-user-screenname
		font-size 3.23vw
		font-weight 400
		margin-top 0.60vw
	div.invite-user-screenname:before
		content '@'
.accept-section
	.v-list-item__avatar
		margin-top 1.5vw
		margin-bottom 1.5vw
.dummy_image
	background-color #F5F5F5
.notifications-container
	.v-list-item__avatar
		margin-top 0
		margin-bottom 0
.v-avatar img
	background-color #f1f1f1
</style>
