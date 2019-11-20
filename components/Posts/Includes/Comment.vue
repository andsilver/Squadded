<template>
	<section class="comment">
		<UserLink
			ref="comment-author-user-link"
			size="30"
			:user="comment.author"
			hide-name
		/>
		<p class="comment_text_row">
			<UserLink
				ref="comment-author-name-user-link"
				class="comment_user_name"
				:user="comment.author"
				hide-avatar
			/>:
			<span
				ref="comment-text"
				class="comment_text"
			>{{ comment.text }}</span>
		</p>
		<button class="comment_like_button">
			<v-icon
				class="comment_buttons_icon"
				color="#B8B8BA"
				size="22"
			>
				mdi-heart{{ '-outline' }}
			</v-icon>
		</button>
	</section>
</template>

<script>
import UserLink from '~/components/UserLink';

export default {
	name: 'PostComment',
	components: {
		UserLink,
	},
	props: {
		comment: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style lang="stylus">
	.comment
		display flex

	.comment_user_name
		font-weight 500

	.comment_user_name span
		color black

	.comment_text_row
		width 75%
		font-size .7em
		line-height 1.2em
		margin-bottom 0 !important
		padding-top 5%

	.comment_text
		color #B8B8BA
		font-weight 400

	.comment_like_button
		width 36px
		position relative

	.comment_buttons_icon
		position absolute
		left 7px
		top 50%
		margin-top -25%
</style>
