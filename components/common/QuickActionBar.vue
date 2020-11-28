<template>
	<div class="quick-action-bar">
		<div class="quick-action-bar-content d-flex align-center">
			<UserLink :user="user" size="26px" hide-name />
			<textarea
				ref="question"
				v-model="question"
				class="flex-grow-1 mr-7"
				:placeholder="$t('quick_question')"
				:rows="1"
			/>
			<v-icon
				v-if="question"
				class="message-icon"
				@click="send"
			>
				mdi-send
			</v-icon>
		</div>
		<div class="pop-over" :class="{'pop-over-hide': hidePopover }">
			<div class="pop-over-content">
				{{ $t('quick_question_popover') }}
			</div>
		</div>
	</div>
</template>

<script>
import autosize from 'autosize';
import UserLink from '~/components/UserLink';
import { QUESTION_COLORS, GA_ACTIONS, HIDE_QUICK_QUESTION_POPOVER } from '~/consts';
import createPost from '~/mixins/create-post';

export default {
	components: {
		UserLink,
	},
	mixins: [createPost],
	props: {
		pending: {
			type: Boolean,
			required: true,
		},
		open: {
			type: Boolean,
			required: true,
		},
	},
	data: () => ({
		question: '',
		hidePopover: true,
	}),
	computed: {
		user () {
			return this.$store.state.user.me;
		},
	},
	watch: {
		pending () {
			this.setHidePopover();
		},
		open () {
			this.setHidePopover();
		},
	},
	mounted () {
		autosize(this.$refs.question);
		this.setHidePopover();
	},
	methods: {
		async send () {
			if (!this.question) {
				return;
			}
			const text = this.question;

			if (!await this.checkActionPermission()) {
				return;
			}
			const pane = QUESTION_COLORS[Math.floor(Math.random() * QUESTION_COLORS.length)];
			const msg = {
				private: false,
				text,
				type: 'questionPost',
				...pane,
			};
			this.createPost(msg, '/all');
			this.$gaAction(GA_ACTIONS.CREATE_POST_QUESTION);
			this.question = '';
			setTimeout(() => autosize.update(this.$refs.question));
		},
		setHidePopover () {
			if (sessionStorage.getItem(HIDE_QUICK_QUESTION_POPOVER)) {
				this.hidePopover = true;
				return;
			} else {
				this.hidePopover = false;
			}
			if (!this.pending && !this.hidePopover && this.open) {
				setTimeout(() => {
					sessionStorage.setItem(HIDE_QUICK_QUESTION_POPOVER, Date.now().toString());
					this.hidePopover = true;
				}, 4000);
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.quick-action-bar
	padding 4px 12px
	padding-top 8px
	position relative

	&-content
		border 1px solid #dbdbdb
		border-radius 10px
		padding-left 4px

		textarea
			font-size 12px
			line-height 20px
			font-weight 500

			&:focus
				outline none

	>>> .v-list-item__avatar
		margin-top 4px
		margin-bottom 4px
		margin-right 8px !important

	.message-icon
		width 24px
		height 24px
		position absolute
		top 15px
		right 18px
		background-color #000
		border-radius 50%
		&::before
			content ''
			background-image url('~assets/img/submit-plane.svg')
			width: 24px
			height: 24px
			background-repeat no-repeat
			background-position 4px
			background-size 14px

.pop-over
	position absolute
	z-index 300
	border-radius 10px
	bottom 50px
	width 100%
	transition all linear 0.3s
	opacity 1
	transform scale(1)

	&-content
		width 64vw
		margin 0 auto
		background black
		border-radius 4px
		color white
		padding 6px
		text-align center
		font-size 9px
		font-weight 600

		&:after
			content ''
			border 10px solid transparent;
			position absolute
			border-top-color black
			left calc(50% - 10px)
			bottom -16px

	&-hide
		transform scale(0.1)
		opacity 0
</style>
