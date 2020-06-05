<template>
	<Button ref="resquadd-button" class="flex-grow-1 resquadd" :class="{save_inactive: !item.squadded}" :active="item.squadded" @click.native="click">
		<v-icon v-if="!item.squadded" small>
			sqdi-squadded-icon
		</v-icon>
		<img v-else src="~assets/img/save-check.svg" class="saved-icon">
		<span class="ml-2">{{ $t(`${ item.squadded ? 'paired.Saved' : 'paired.Save' }`) }}</span>
	</Button>
</template>

<script>
import { ActivityStore, ActivityActions, ActivityMutations } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions, PostMutations } from '~/store/post';
import { HomeStore, HomeMutations } from '~/store/home';
import { PairedItemStore, PairedItemMutations } from '~/store/paired-item';
import Button from '~/components/common/Button';

export default {
	name: 'ReSquaddButton',
	components: {
		Button,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	methods: {
		click(e) {
			this.item.squadded ? this.unwish() : this.reSquaddPost();
			e.stopPropagation();
			e.cancelBubble = true;
			return false;
		},
		async reSquaddPost() {
			this.item.squadded = true;
			const post = await this.$store.dispatch(`${PostStore}/${PostActions.reSquaddItem}`,	{ item: this.item });
			this.$store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
			this.$store.commit(`${ActivityStore}/${ActivityMutations.addPost}`, {
				post,
				merchantId: this.$store.state.merchant.id,
				userId: this.$store.state.user.me.userId,
			});
			this.$forceUpdate();
		},
		async unwish() {
			this.item.squadded = false;
			await this.$store.dispatch(`${ActivityStore}/${ActivityActions.unwish}`, this.item);
			this.$store.commit(`${PostStore}/${PostMutations.unsquadd}`, this.item.itemId);
			this.$store.commit(`${PairedItemStore}/${PairedItemMutations.unsquadd}`, this.item.itemId);
			this.$store.commit(`${FeedStore}/${FeedMutations.unsquadd}`, this.item.itemId);
			this.$store.commit(`${HomeStore}/${HomeMutations.unsquadd}`, this.item.itemId);
			this.$forceUpdate();
		},
	},
};
</script>

<style scoped lang="stylus">
.resquadd
	background-color var(--brand-color) !important

.save_inactive
	background-color transparent !important
	color #000
	border 1px solid #000
	&::before
		background-color #fff !important
img.saved-icon
	width 3.4vw
</style>
