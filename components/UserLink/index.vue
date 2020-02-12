<template>
	<nuxt-link ref="user-link" :to="getUserLink()">
		<v-list-item v-if="!hideAvatar" class="pa-0 user_link_header">
			<v-list-item-avatar class="mr-3" :size="size">
				<img v-if="user && user.avatar" :src="user && user.avatar" :alt="user && user.screenName">
				<v-icon v-else color="#b8b8ba">
					mdi-account-circle-outline
				</v-icon>
				<v-btn
					v-if="follow && user.guid !== me.userId"
					class="follow"
					:class="{highlight: showPopover}"
					dark
					icon
					outlined
					size="35%"
					width="60%"
					height="60%"
					@click="goFollow"
				>
					<v-icon :size="`${sizeValue * 0.2571}${sizeLength}`">
						mdi-eye-outline
					</v-icon>
				</v-btn>
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
					{{ user.name || user.screenName }}
				</v-list-item-title>
				<v-list-item-subtitle v-if="ts" class="user_timestamp">
					{{ timeString }}
				</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>
		<span v-else class="user_name">
			{{ user.name || user.screenName }}
		</span>
	</nuxt-link>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { UserStore } from '~/store/user';
import { ActivityStore, ActivityMutations } from '~/store/activity';

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
		follow: {
			type: Boolean,
			default: false,
		},
		ts: {
			type: Number,
			default: 0,
		},
		user: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
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
		this.showPopover = !!this.user.showPopover;
		if (this.showPopover) {
			document.addEventListener('click', () => {
				this.showPopover = false;
				this.$store.commit(`${ActivityStore}/${ActivityMutations.hidePopover}`);
			});
		}
	},
	methods: {
		getUserLink() {
			return (this.user.guid === this.me.userId ? { name: 'me' }
				: { name: 'user-id', params: { id: this.user.guid } }
			);
		},
		goFollow (e) {
			e.stopPropagation();
			e.preventDefault();
			const to = this.getUserLink();
			to.hash = '#follow';
			this.$router.push(to);
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
.user_name
	font-size 3.23vw
	font-weight 600
	line-height 4vw
.user_timestamp
	font-size 3.230vw
	font-weight 400
.user_link_header
	position relative
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
		margin-top 5px
		margin-left 1.53vw
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
.for-feed .message-user-image
	background-color #FFFFFF
	border-top-left-radius 3.07vw
	border-bottom-left-radius 3.07vw
	border 0.307vw solid #DBDBDB
	border-right 0
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
</style>
