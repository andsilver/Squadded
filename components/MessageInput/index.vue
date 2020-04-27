<template>
	<section class="d-flex">
		<UserLink v-if="userLink" size="7.69vw" :user="me" hide-name class="message-user-image" />
		<CommentInputBox ref="comment-input-box" class="comment-input-box" :class="{'for-feed': forFeed}" @send="send" />
	</section>
</template>

<script lang="js">
import { createNamespacedHelpers, mapState } from 'vuex';
import UserLink from '~/components/UserLink';
import { UserStore } from '~/store/user';
import CommentInputBox from '~/components/Comments/Includes/CommentInputBox';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	name: 'MessageInput',
	components: {
		UserLink,
		CommentInputBox,
	},
	props: {
		action: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: '',
		},
		post: {
			type: Object,
			required: true,
		},
		text: {
			type: String,
			default: '',
		},
		userLink: {
			type: Boolean,
			default: false,
		},
		forFeed: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		textValue: '',
	}),
	computed: {
		...userState([
			'me',
		]),
		...mapState([
			'squad',
		]),
	},
	mounted () {
		this.textValue = this.text;
	},
	methods: {
		send (textValue) {
			const { action, post } = this;
			this.$store.dispatch(action, {
				post,
				text: textValue,
			});
			this.$emit('send');
		},
		keydown (e) {
			if (e.keyCode === 13 && this.textValue.length) {
				this.send();
				return;
			}
			if (e.keyCode === 27) {
				this.$emit('cancel');
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.message-user-image
	background-color #F4F4F5
	border-top-left-radius 3.07vw
	border-bottom-left-radius 3.07vw
.for-feed
	border 0.307vw solid #DBDBDB
	border-left 0
	background white !important
.comment-input-box
	height 100%
	width 100%
	background #F4F4F5
</style>
