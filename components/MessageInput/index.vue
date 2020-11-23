<template>
	<section>
		<CommentPreview
			v-if="selectedPosts.length"
			:selected-posts="selectedPosts"
			@close="post => handleSelectEmbeddedItem(post)"
		/>
		<div class="row-input-box d-flex">
			<UserLink v-if="userLink" size="26px" :user="me" hide-name class="message-user-image" />
			<CommentInputBox
				ref="comment-input-box"
				class="comment-input-box"
				:class="{'for-feed': forFeed}"
				:value="text"
				:for-feed="forFeed"
				:is-panel-open="isPanelOpen"
				:is-selected-posts="!!selectedPosts.length"
				@send="send"
			/>
			<img
				v-if="!forFeed"
				ref="open-panel-button"
				contain
				width="25px"
				src="~assets/img/logo-simple.svg"
				class="add-item"
				@click="isPanelOpen = !isPanelOpenProps"
			>
		</div>
		<v-divider v-if="isPanelOpen" class="divider-panel" />
		<CommentPanel
			v-if="isPanelOpen"
			class="card-panel-box"
			:wishlist="wishlist"
			@selectEmbeddedItem="post => handleSelectEmbeddedItem(post)"
		/>
	</section>
</template>

<script lang="js">
import { createNamespacedHelpers, mapState } from 'vuex';
import UserLink from '~/components/UserLink';
import { UserStore } from '~/store/user';
import CommentInputBox from '~/components/Comments/Includes/CommentInputBox';
import CommentPanel from '~/components/Comments/Includes/CommentPanel';
import CommentPreview from '~/components/Comments/Includes/CommentPreview';
import { GA_ACTIONS } from '~/consts';
import { ActivityStore, ActivityActions } from '~/store/activity';
import { checkActionPermission } from '~/utils/isAuth';

const userState = createNamespacedHelpers(UserStore).mapState;
const activityState = createNamespacedHelpers(ActivityStore).mapState;

export default {
	name: 'MessageInput',
	components: {
		UserLink,
		CommentInputBox,
		CommentPanel,
		CommentPreview,
	},
	props: {
		action: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: '',
		},
		post: {
			type: Object,
			required: true,
		},
		text: {
			type: String,
			default: '',
		},
		userLink: {
			type: Boolean,
			default: false,
		},
		forFeed: {
			type: Boolean,
			default: false,
		},
		isPanelOpenProps: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		textValue: '',
	}),
	computed: {
		...userState([
			'me',
		]),
		...mapState([
			'squad',
		]),
		...activityState([
			'wishlist',
		]),
		selectedPosts() {
			return this.wishlist ? this.wishlist.filter(({ selected }) => selected) : [];
		},
		selectedItems() {
			return this.selectedPosts.map(({ item }) => item);
		},
		isPanelOpen: {
			get() {
				return this.isPanelOpenProps;
			},
			set(value) {
				this.$emit('update:isPanelOpenProps', value);
			},
		},
	},
	created () {
		this.fetchWishlist();
	},
	mounted () {
		this.textValue = this.text;
	},
	destroyed() {
		this.resetSelected();
	},
	methods: {
		fetchWishlist() {
			this.$store.dispatch(`${ActivityStore}/${ActivityActions.fetchItems}`, {
				type: 'wishlist',
				guid: undefined,
			});
		},
		async send (textValue) {
			const allow = await checkActionPermission(this.$store, this.$root);

			if (!allow) {
				return;
			}
			const { action, post, selectedItems } = this;

			let payload = {
				post,
				text: textValue,
			};

			if (selectedItems.length) {
				payload = {
					...payload,
					items: selectedItems,
				};
			}
			this.$store.dispatch(action, payload);
			this.$emit('send');
			this.$gaAction(GA_ACTIONS.COMMENT);
			this.resetSelected();
			this.isPanelOpen = false;
		},
		keydown (e) {
			if (e.keyCode === 13 && this.textValue.length) {
				this.send();
				return;
			}
			if (e.keyCode === 27) {
				this.$emit('cancel');
			}
		},
		handleSelectEmbeddedItem(post) {
			if (!post.selected === true && this.selectedPosts.length === 5) {
				return;
			};
			post.selected = !post.selected;
		},
		resetSelected() {
			if (this.wishlist && this.wishlist.length) {
				this.wishlist.forEach((post) => { post.selected = false; });
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.row-input-box
	background #F4F4F5
	border-radius 12px
	margin-right 18px
.for-feed .row-input-box
	background white
	border 1px solid #dbdbdb
	margin-right 0
.comment-input-box
	width 100%
.divider-panel
	margin 8px 0
.card-panel-box
	position absolute
	height: calc(37vh - 57px);
	width 90%
.add-item
	position absolute
	cursor pointer
	width 16px
	top 12px
	right 7px
</style>
