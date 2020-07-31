<template>
	<CardFrame
		ref="card-frame"
		:price="price"
		:origin-price="originPrice"
		:title="item.title"
		:is-poll-post="isPollPost"
		:loading="loading"
		:item="item"
		:show-bag="isClickable"
		:show-refresh="showRefreshicon"
		:post-id="postId"
		:group-post="groupPost"
		:post="post"
		@open="openProduct"
	>
		<ItemImage
			ref="item-image"
			:item="item"
			:resquadd="isClickable"
			@open="openProduct"
		/>
	</CardFrame>
</template>

<script>
import CardFrame from './CardFrame';
import ItemImage from './ItemImage';
import { price } from '~/helpers';
import { OPENED_POST } from '~/consts/keys';
import { SquadAPI } from '~/services/SquadAPI';
import { FeedPost } from '~/classes/FeedPost';
import { sendGAction } from '~/utils/ga-action';
import { GA_ACTIONS } from '~/consts';
import { addGAquery } from '~/utils/track-source-link';

export default {
	name: 'ProductCard',
	components: {
		CardFrame,
		ItemImage,
	},
	props: {
		isPollPost: {
			type: Boolean,
			default: false,
		},
		item: {
			type: Object,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		voted: {
			type: Boolean,
			default: false,
		},
		showRefreshicon: {
			type: Boolean,
			default: false,
		},
		postId: {
			type: String,
			required: false,
			default: null,
		},
		groupPost: {
			type: Boolean,
			default: false,
		},
		post: {
			type: FeedPost,
			required: false,
			default: () => {},
		},
		shifted: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		price () {
			return price(this.item.currency, this.item.price, this._i18n.locale);
		},
		originPrice () {
			if (this.item.origPrice) {
				return price(this.item.currency, this.item.origPrice, this._i18n.locale);
			} else {
				return '';
			}
		},
		isClickable() {
			if (!this.isPollPost || this.voted) {
				return true;
			}
			return false;
		},
	},
	methods: {
		openProduct () {
			if (this.post &&
				(this.post.type === 'galleryPost' || this.post.type === 'outfitPost') &&
				!this.shifted
			) {
				this.$emit('shift');
				return;
			}
			if (this.isClickable) {
				sessionStorage.setItem(OPENED_POST, this.postId);
				// add source on click
				this.item = Object.assign(this.item, {
					url: addGAquery(this.item.url),
				});
				SquadAPI.openProduct(this.item);
				sendGAction(GA_ACTIONS.CLICK_ITEM);
			}
		},
	},
};
</script>

<style lang="stylus" scoped>

</style>
