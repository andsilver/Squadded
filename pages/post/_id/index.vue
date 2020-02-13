<template>
	<v-container class="post-landing">
		<BackBar ref="back-bar" :title="title" />
		<div v-if="post" class="py-4">
			<component :is="getComponent(post)" ref="post-component" :post="post" />
			<Comments ref="post-comments" :post="post" :show-all="showAllComments" />
			<NotSignedInDialog v-if="showNotSignedInDialog" ref="dialog" :user="post.user" />
		</div>
	</v-container>
</template>

<script>
import BackBar from '~/components/common/BackBar';
import Comments from '~/components/Comments';
import { PostStore, PostMutations } from '~/store/post';
import { prefetch } from '~/helpers';
import { FeedPost } from '~/classes/FeedPost';
import GalleryPost from '~/components/Posts/GalleryPost';
import MultiItemPost from '~/components/Posts/MultiItemPost';
import SingleItemPost from '~/components/Posts/SingleItemPost';
import PollPost from '~/components/Posts/PollPost';
import NotSignedInDialog from '~/components/LandingPost/NotSignedInDialog';

export default {
	name: 'PostReactions',
	components: {
		BackBar,
		Comments,
		SingleItemPost,
		PollPost,
		MultiItemPost,
		GalleryPost,
		NotSignedInDialog,
	},
	data: () => ({
		post: null,
		showAllComments: false,
		showNotSignedInDialog: false,
		components: {
			singleItemPost: SingleItemPost,
			pollPost: PollPost,
			outfitPost: MultiItemPost,
			galleryPost: GalleryPost,
		},
	}),
	computed: {
		title() {
			if (this.showAllComments) {
				return this.$t('post.title.comments');
			}
			return this.post ? this.$t(`post.title.${this.post.type}`) : '';
		},
	},
	created () {
		if (this.$route.hash === '#comments') {
			this.showAllComments = true;
		}
		const { id } = this.$route.params;
		this.setPost(id);

		if (!this.$store.state.socket.isAuth) {
			this.showNotSignedInDialog = true;
		}
	},
	methods: {
		setPost(id) {
			prefetch({
				postId: id,
				mutation: `${PostStore}/${PostMutations.setCurrentPost}`,
				store: this.$store,
				type: 'fetchPost',
			}).then((post) => {
				if (post.private && !post.byMe) {
					this.$router.push(`/user/${post.userId}`);
					return;
				}
				this.post = post ? new FeedPost(post) : null;
			});
		},
		getComponent(post) {
			return this.components[post.type];
		},
	},
	head: () => ({
		title: 'Post-Landing',
	}),
};
</script>

<style lang="stylus" scoped>
.post-landing
	>>> .comment-listing
		height unset !important
		padding-left 12px
</style>
