<template>
	<v-container class="post-landing">
		<BackBar ref="back-bar" :title="title" :show-sign-in="!isAuth" />
		<div v-if="post" class="py-4">
			<component :is="getComponent(post)" ref="post-component" :post="post" />
			<Comments v-if="isAuth" ref="post-comments" :post="post" :show-all="showAllComments" />
			<NotSignedInDialog v-if="!isAuth && showNotSignedInDialog" ref="dialog" :post-id="postId" :user="post.user" />
		</div>
		<Preloader v-else class="my-8" />
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Comments from '~/components/Comments';
import Preloader from '~/components/Preloader';
import { PostStore, PostMutations, PostGetters } from '~/store/post';
import { prefetch, onAuth } from '~/helpers';
import { FeedPost } from '~/classes/FeedPost';
import NotSignedInDialog from '~/components/LandingPost/NotSignedInDialog';
import { fetchPost, getComponent } from '~/services/post';

export default {
	name: 'PostReactions',
	components: {
		BackBar,
		Comments,
		Preloader,
		NotSignedInDialog,
	},
	data: () => ({
		post: null,
		showAllComments: false,
		showNotSignedInDialog: false,
		postId: null,
	}),
	computed: {
		title() {
			if (this.showAllComments) {
				return this.$t('post.title.comments');
			}
			return this.post ? this.$t(`post.title.${this.post.type}`) : '';
		},
		isAuth() {
			return this.socket.isAuth;
		},
		...mapState([
			'socket',
		]),
	},
	created () {
		if (this.$route.hash === '#comments') {
			this.showAllComments = true;
		}
		const { id } = this.$route.params;
		this.postId = id;
		this.setPost(id);

		if (!this.isAuth) {
			this.showNotSignedInDialog = true;
		}
	},
	methods: {
		async setPost(id) {
			if (this.isAuth || this.socket.isPendingAuth) {
				await onAuth(this.$store);
				this.post = this.$store.getters[`${PostStore}/${PostGetters.getPostById}`](id);

				if (this.post) {
					return;
				}
				prefetch({
					postId: id,
					mutation: `${PostStore}/${PostMutations.setCurrentPost}`,
					store: this.$store,
					type: 'fetchPost',
				}).then((post) => {
					this.post = post;

					if (post && post.private && (!post.byMe && !post.user.mysquad)) {
						return this.$router.push(`/user/${post.userId}#wishlist`);
					}
				});
				setTimeout(() => {
					if (!this.post) {
						this.$router.push('/error');
					}
				}, 6000);
			} else {
				fetchPost(id).then((post) => {
					if (post && post.private) {
						return this.$router.push(`/user/${post.userId}`);
					}
					this.post = post ? new FeedPost(post) : null;
				}).catch(() => {
					this.$router.push('/error');
				});
			}
		},
		getComponent,
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
		padding-bottom 40px
</style>
