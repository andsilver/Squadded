<template>
	<span ref="comment" class="comment-show" @click="onClick" />
</template>

<script>
import { utils, MENTION } from './utils';

export default {
	props: {
		comment: {
			type: String,
			required: true,
		},
		post: {
			type: Object,
		},
	},
	data: () => ({
		mentions: [],
	}),
	watch: {
		comment () {
			this.format();
		},
	},
	mounted() {
		this.format();
	},
	methods: {
		format() {
			const mentionText = utils.htmlEncode(this.comment);
			const regex = new RegExp('(' + MENTION + ')\\[(.*?)\\]\\((.*?):(.*?)\\)', 'gi');
			let match;
			let newMentionText = mentionText;
			while ((match = regex.exec(mentionText)) != null) {
				const mention = { userId: match[4], id: match[3], screenName: match[2], trigger: match[1] };
				newMentionText = newMentionText.replace(match[0], utils.mentionItemNavigate(mention));
				this.mentions.push(mention);
			}
			this.$refs.comment.innerHTML = newMentionText;
		},
		onClick(e) {
			const { target } = e;

			if (target.className === 'mentioned-link') {
				this.$router.push('/user/' + target.id);
			} else if (target.className === 'comment-show comment_text' && this.post) {
				this.$router.push(`/post/${this.post.postId}/reactions`);
			}
		},
	},
};
</script>
<style>
.mentioned-link {
	color: #fd6256 !important;
	background-color: #fefeff;
	font-weight: 600 !important;
}
</style>
