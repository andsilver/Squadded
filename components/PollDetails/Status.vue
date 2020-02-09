<template>
	<div class="mb-2 poll_status">
		<span ref="expiration" class="mr-2">{{ post.closed ? $t('poll.expired') : time }}</span>
		<span>|</span>
		<span ref="votes" class="ml-2">{{ votes }} {{ $tc('poll.votes', votes) }}</span>
	</div>
</template>

<script>
import { FeedPost } from '~/classes/FeedPost';

export default {
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
	computed: {
		votes() {
			return this.post.item1.votes + this.post.item2.votes;
		},
		time() {
			const timestring = {
				future: '%s left',
			};
			window.moment.locale(this._i18n.locale, { relativeTime: timestring });
			return this.post.expires && window.moment(this.post.expires).fromNow();
		},
	},
};
</script>

<style scoped lang="stylus">
.poll_status
	span
		min-height 12px
		max-height 8.615vw
		word-break normal
		overflow hidden
		font-size 3.38vw
		line-height 4.61vw
		font-weight 500
		color #B8B8BA
</style>
