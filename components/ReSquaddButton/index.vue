<template>
	<button
		ref="resquadd-button"
		class="resquadd sqdi-squadded-icon"
		:class="{
			'is-resquadded': item.squadded,
			invert,
		}"
		@click="click"
	/>
</template>

<script>
import { ActivityStore, ActivityActions, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import { HomeStore, HomeMutations } from '~/store/home';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { PairedItemStore, PairedItemMutations } from '~/store/paired-item';
import { isMonoMerchant } from '~/utils/is-mono-merchant';

export default {
	name: 'ReSquaddButton',
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		invert: false,
	}),
	computed: {
		checkOtherMerchant() {
			return isMonoMerchant(this.$store.state) && this.item.merchantId !== this.$store.state.merchant.id;
		},
	},
	mounted () {
		const { backgroundColor } = this.$store.state.merchant;
		if (backgroundColor) {
			this.invert = true;
		}
	},
	methods: {
		click (e) {
			this.item.squadded ? this.unwish() : this.reSquaddPost();
			e.stopPropagation();
			e.cancelBubble = true;
			return false;
		},
		async reSquaddPost () {
			this.item.squadded = true;

			if (this.checkOtherMerchant) {
				return;
			}
			const post = await this.$store.dispatch(`${PostStore}/${PostActions.reSquaddItem}`, { item: this.item });
			this.$store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
			this.$store.commit(`${ActivityStore}/${ActivityMutations.addPost}`, {
				post,
				merchantId: this.$store.state.merchant.id,
				userId: this.$store.state.user.me.userId,
			});
			this.$forceUpdate();
		},
		async unwish () {
			this.item.squadded = false;

			if (this.checkOtherMerchant) {
				return;
			}
			this.$store.commit(`${PostStore}/${PostMutations.unsquadd}`, this.item.itemId);
			this.$store.commit(`${PairedItemStore}/${PairedItemMutations.unsquadd}`, this.item.itemId);
			this.$store.commit(`${FeedStore}/${FeedMutations.unsquadd}`, this.item.itemId);
			this.$store.commit(`${HomeStore}/${HomeMutations.unsquadd}`, this.item.itemId);
			await this.$store.dispatch(`${ActivityStore}/${ActivityActions.unwish}`, this.item);
			this.$forceUpdate();
		},
	},
};
</script>

<style scoped lang="stylus">
.resquadd
	position absolute
	right 2.50vw
	top 3.07vw
	width 30px
	height 30px
	border-radius 50%
	background-color #707070
	color white
	text-align center
	outline none
	transition background-color .1s ease-in-out 0s,
		opacity .1s ease-in-out 0s

	&.for-wishlist
		background-color rgba(0,0,0,0.1)
		color #000000
		text-align center
		opacity 1

	&.sqdi-squadded-icon
		&:before
			vertical-align middle
			line-height 24px

	&.is-resquadded:not(.invert)
		background-color var(--brand-color)
		color white
		opacity 1

	&.invert
		background-color var(--bg-color) !important
		color black
		&.is-resquadded
			color var(--brand-color) !important
			opacity 1

.remove-button.resquadd.is-resquadded
	background-color transparent
	&.sqdi-squadded-icon:before
		content ''
		background-image url('~assets/img/remove-wl.svg')
		width 3.69vw
		height 3.69vw
		background-size 3.69vw
.post-card
	button.resquadd.is-resquadded
		background-color rgba(0, 0, 0, 30%)

.wishlist-remove.resquadd
	background-color rgba(0,0,0,0.1)
	color #000000
	text-align center
	opacity 1
</style>
