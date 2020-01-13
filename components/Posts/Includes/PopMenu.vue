<template>
	<div>
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
				<v-list-item class="post-menu-share">
					<v-list-item-title @click="share">
						{{ $t(`post.share`) }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
		<v-dialog v-model="showShare">
			<SharePost ref="share-post-modal" :post-link="postLink" />
		</v-dialog>
	</div>
</template>

<script>
import SharePost from './SharePost';
import { PostStore, PostActions } from '~/store/post';
import { FeedMutations, FeedStore } from '~/store/feed';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { PairedItemStore, PairedItemMutations } from '~/store/paired-item';
const CANCELED_BY_USER = 20;

export default {
	components: {
		SharePost,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		current: null,
		parentNode: null,
		showShare: false,
	}),
	computed: {
		currentText () {
			return this.current ? {
				question: this.$t(`post.pop.${this.current}.question`),
				description: this.$t(`post.pop.${this.current}.description`),
				decline: this.$t(`post.pop.${this.current}.decline`),
			} : {};
		},
		target () {
			const { siteUrl, siteTitle } = this.$store.state.merchant;
			return {
				id: this.post.guid,
				url: siteUrl,
				title: siteTitle,
			};
		},
		postLink () {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			return `${API_ENDPOINT}/community/sharePost?t=${btoa(target)}`;
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
			this.$store.dispatch(`${PostStore}/${PostActions.reportPost}`, { post: this.post });
			this.$store.commit(`${FeedStore}/${FeedMutations.removePost}`, postId);
			this.$store.commit(`${ActivityStore}/${ActivityMutations.removePost}`, postId);
			this.$store.commit(`${PairedItemStore}/${PairedItemMutations.removePost}`, postId);
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
		async share() {
			this.showShare = false;
			if (navigator && navigator.share) {
				const { siteTitle } = this.$store.state.merchant;
				try {
					await navigator.share({
						title: siteTitle,
						text: siteTitle,
						url: this.postLink,
					});
				} catch (error) {
					if (error.code !== CANCELED_BY_USER) {
						this.showModal();
					}
				}
			} else {
				this.showModal();
			}
		},
		showModal () {
			this.showShare = true;
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
