<template>
	<section class="comment">
		<UserLink
			ref="comment-author-user-link"
			size="7.69vw"
			:user="comment.author"
			hide-name
		/>
		<p class="comment_text_row">
			<UserLink
				ref="comment-author-name-user-link"
				class="comment_user_name"
				:user="comment.author"
				hide-avatar
			/>
			<span
				ref="comment-text"
				class="comment_text"
			>{{ comment.text }}</span>
			<span
				class="message-time"
			>
				{{ timeString }}
			</span>
		</p>
		<!--Since at this moment we don't have any functionality in PopMenu for User->ME, we are not displaying it for such User at all-->
		<PopMenu v-if="!comment.author.isMe" :comment="comment" />
	</section>
</template>

<script>

import PopMenu from './PopMenu';
import UserLink from '~/components/UserLink';

export default {
	name: 'PostComment',
	components: {
		UserLink,
		PopMenu,
	},
	props: {
		comment: {
			type: Object,
			required: true,
		},
	},
	computed: {
		timeString () {
			const timestring = {
				future: 'in %s',
				past: '%s ago',
				s: '1s',
				ss: '%ds',
				m: '1m',
				mm: '%dm',
				h: '1h',
				hh: '%dh',
				d: '1d',
				dd: '%dd',
				M: '4w',
				MM: '%dm',
				y: '1y',
				yy: '%dy',
			};
			window.moment.locale(this._i18n.locale, { relativeTime: timestring });
			return this.comment.ts && window.moment(this.comment.ts).fromNow(true);
		},
	},
};
</script>

<style lang="stylus">
	.comment
		display flex
		margin-bottom 6.153vw

	.comment_user_name
		font-weight 500

	.comment_user_name span
		color black

	.comment_text_row
		width calc(100% - 36px)
		font-size 3.23vw
		line-height 4VW
		margin-bottom 0 !important
		margin-right -5px

	.comment_text
		color #000000
		font-weight 400

	.comment_like_button
		width 36px
		position relative

	.comment_buttons_icon
		position absolute
		left 7px
		top 50%
		margin-top -25%
	span.message-time
		display block
		margin-top 1vw
		font-size 3.23vw
		font-weight 600
		color #B8B8BA
</style>
