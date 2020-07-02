<template>
	<div class="full_post">
		<span v-if="!visible" v-observe-visibility="visibilityChanged" class="visibility" />
		<template v-if="visible">
			<div v-if="!hideUser" class="d-flex post-user-sec">
				<UserLink
					ref="user-link"
					class="post_user_link"
					:user="post.user"
					:ts="post.ts"
					size="10.76vw"
				/>
				<PopMenu :post="post" @edit="toggleTextEditor" />
			</div>
			<h3
				v-if="isTextVisible && !hideUser"
				ref="post-text"
				:class="{card_title: true, placeholder: isPlaceHolder, 'px-2': groupPost}"
				@click="toggleTextEditor"
			>
				<CommentShow ref="comment-show" :comment="post.text || (isPlaceHolder && $t('post.textPlaceholder'))" />
			</h3>
			<Caption
				v-if="showTextEditor"
				ref="post-text-input"
				class="mb-3"
				:action="editPostText"
				:placeholder="$t('post.textPlaceholder')"
				:post="post"
				:text="post.text"
				@send="toggleTextEditor"
				@cancel="toggleTextEditor"
			/>
			<slot />
			<Actions v-if="!hideUser && !groupPost" :post="post" />
		</template>
	</div>
</template>

<script>
import Actions from './Actions';
import PopMenu from './PopMenu';
import Caption from './Caption';
import UserLink from '~/components/UserLink';
import { PostStore, PostActions } from '~/store/post';
import CommentShow from '~/components/Comments/Includes/CommentShow';

export default {
	name: 'Post',
	components: {
		Actions,
		Caption,
		PopMenu,
		UserLink,
		CommentShow,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
		hideUser: {
			type: Boolean,
			default: false,
		},
		groupPost: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		visible: false,
		showTextEditor: false,
		editPostText: `${PostStore}/${PostActions.editText}`,
	}),
	computed: {
		isTextVisible () {
			return this.post.byMe ? !this.showTextEditor : this.post.text;
		},
		isPlaceHolder () {
			return (this.post.byMe && !this.post.text);
		},
	},
	methods: {
		toggleTextEditor () {
			if (!this.post.byMe) {
				return;
			}
			this.showTextEditor = !this.showTextEditor;
			setTimeout(() => {
				if (this.$refs['post-text-input']) {
					this.$refs['post-text-input'].$el.querySelector('input').focus();
				}
			});
		},
		visibilityChanged(isVisible) {
			this.visible = this.visible || isVisible;
		},
	},
};
</script>

<style lang="stylus" scoped>
.post-user-sec
	margin-bottom 2.87vw
.post_user_link
	flex 1 1 auto

.counter-icon
	position relative

.count
	line-height 22px
	font-size .8em
	font-weight 600
	margin-left 3%

.full_post
	margin-bottom 2.87vw
	position relative

.card_title
	font-size 3.692vw
	font-weight 500
	margin-bottom 2.969vw
	cursor pointer

.placeholder
	color #757575

.grid_gallery
	.full_post
		margin-bottom 3.07vw
.grouped-post
	.post-user-sec
		padding 0 12px
	.card_title
		padding-right 12px !important
		padding-left 12px !importan
.single-post
	.post-user-sec
		padding 0px
.visibility
	width 3px
	height 500px
	display block
	background transparent
</style>
<style lang="stylus">
.post-title-input
	margin-left 12px

	.comment-input
		border-top-left-radius 3.07vw
		border-bottom-left-radius 3.07vw

		.squadders
			left -4.61vw
</style>
