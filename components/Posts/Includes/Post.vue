<template>
	<div class="full_post">
		<div v-if="!hideUser" class="d-flex post-user-sec">
			<UserLink
				ref="user-link"
				class="post_user_link"
				:user="post.user"
				:ts="post.ts"
				follow
				size="10.76vw"
			/>
			<PopMenu :post="post" />
		</div>
		<h3
			v-if="isTextVisible && !hideUser"
			ref="post-text"
			:class="{card_title: true, placeholder: isPlaceHolder, 'px-2': groupPost}"
			@click="toggleTextEditor"
		>
			{{ post.text || (isPlaceHolder && $t('post.textPlaceholder')) }}
		</h3>
		<MessageInput
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
	</div>
</template>

<script>
import Actions from './Actions';
import PopMenu from './PopMenu';
import MessageInput from '~/components/MessageInput';
import UserLink from '~/components/UserLink';
import { PostStore, PostActions } from '~/store/post';

export default {
	name: 'Post',
	components: {
		Actions,
		MessageInput,
		PopMenu,
		UserLink,
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
	margin-bottom 6.15vw
	position relative

.card_title
	font-size 3.692vw
	font-weight 500
	margin-bottom 3%

.placeholder
	color #757575

.grid_gallery
	.full_post
		margin-bottom 3.07vw
.grouped-post
	.post-user-sec
		padding 0 12px

</style>
