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
		</v-list>
	</v-menu>
</template>

<script>
import { PostStore, PostActions } from '~/store/post';

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
		togglePrivate () {
			this.current = this.post.private ? 'setPublic' : 'setPrivate';
			this.$root.$emit('prompt', {
				text: this.currentText,
				hide: this.hide,
				confirm: this.confirm,
			});
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
.v-list-item
	min-height 26px
</style>
