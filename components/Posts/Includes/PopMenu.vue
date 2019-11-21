<template>
	<v-menu bottom offset-y>
		<template v-slot:activator="{ on }">
			<v-btn icon class="button_more" v-on="on">
				<v-icon>
					sqdi-more
				</v-icon>
			</v-btn>
		</template>

		<v-list>
			<v-list-item>
				<v-list-item-title @click="togglePrivate">
					{{ $t(`post.pop.${ post.private ? 'setPublic' : 'setPrivate' }.menu`) }}
				</v-list-item-title>
			</v-list-item>
			<v-list-item>
				<v-list-item-title @click="promptDelete">
					{{ $t(`post.pop.deletePost.menu`) }}
				</v-list-item-title>
			</v-list-item>
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
