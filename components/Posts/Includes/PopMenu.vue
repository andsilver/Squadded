<template>
	<v-menu :attach="parentNode" bottom offset-y left>
		<template v-slot:activator="{ on }">
			<v-btn icon class="button_more" v-on="on">
				<v-icon>
					sqdi-more
				</v-icon>
			</v-btn>
		</template>

		<v-list>
			<template v-if="post.byMe">
				<v-list-item class="post-menu-edit">
					<v-list-item-title @click="togglePrivate">
						{{ $t(`post.pop.${ post.private ? 'setPublic' : 'setPrivate' }.menu`) }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item class="post-menu-edit">
					<v-list-item-title @click="promptDelete">
						{{ $t(`post.pop.deletePost.menu`) }}
					</v-list-item-title>
				</v-list-item>
			</template>
			<template v-else>
				<v-list-item class="post-menu-report">
					<v-list-item-title @click="promptReportPost">
						{{ $t(`post.pop.reportPost.menu`) }}
					</v-list-item-title>
				</v-list-item>
			</template>
		</v-list>
	</v-menu>
</template>

<script>
import { PostStore, PostActions } from '~/store/post';
import { FeedMutations, FeedStore } from '~/store/feed';
import { ActivityStore, ActivityMutations } from '~/store/activity';

export default {
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		current: null,
		parentNode: null,
	}),
	computed: {
		currentText () {
			return this.current ? {
				question: this.$t(`post.pop.${this.current}.question`),
				description: this.$t(`post.pop.${this.current}.description`),
				decline: this.$t(`post.pop.${this.current}.decline`),
			} : {};
		},
	},
	mounted () {
		this.parentNode = this.$parent.$el;
	},
	methods: {
		hide () {
			this.current = null;
		},
		confirm () {
			this[this.current]();
			this.hide();
		},
		deletePost () {
			const { postId } = this.post;
			this.$ws.sendObj({
				type: 'deletePost',
				postId,
			});
			this.$store.commit(`${FeedStore}/${FeedMutations.removePost}`, postId);
			this.$store.commit(`${ActivityStore}/${ActivityMutations.removePost}`, postId);
		},
		reportPost () {
			const { postId } = this.post;
			const { id: merchantId } = this.$store.state.merchant;
			const { userId } = this.$store.state.user.me;

			this.$ws.sendObj({
				type: 'report',
				postId,
				merchantId,
				userId,
			});

			/**
			 * todo - After post was reported probably it makes sense to hide it from current user. But I will take it
			 * later when the functionality on a backend is ready. Because if we just hide it inside store, it will
			 * not be marked as hidden at backend and will be still shown to user further. So either we make frontend
			 * and backend with the same functionality or (if excluding reported posts from this user's result is not
			 * needed yet) skip committing removing posts from store
             */
		},
		togglePrivate () {
			this.current = this.post.private ? 'setPublic' : 'setPrivate';
			this.prompt();
		},
		prompt () {
			this.$root.$emit('prompt', {
				text: this.currentText,
				hide: this.hide,
				confirm: this.confirm,
			});
		},
		promptDelete () {
			this.current = 'deletePost';
			this.prompt();
		},
		setPrivate () {
			this.$store.dispatch(`${PostStore}/${PostActions.updatePrivate}`, { post: this.post, private: true });
		},
		setPublic () {
			this.$store.dispatch(`${PostStore}/${PostActions.updatePrivate}`, { post: this.post, private: false });
		},
		promptReportPost() {
			this.current = 'reportPost';
			this.prompt();
		},
	},
};
</script>

<style lang="stylus" scoped>
.button_more
	align-self center
	.v-icon
		color #B8B8BA
		font-size 18px
</style>
