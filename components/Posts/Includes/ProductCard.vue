<template>
	<CardFrame
		ref="card-frame"
		:price="price"
		:title="item.title"
		:is-poll-post="isPollPost"
		:loading="loading"
		:item="item"
		:show-bag="isClickable"
		:show-refresh="showRefreshicon"
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
import { SquadAPI } from '~/services/SquadAPI';

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
	},
	computed: {
		price () {
			return price(this.item.currency, this.item.price, this._i18n.locale);
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
			this.isClickable && SquadAPI.openProduct(this.item);
		},
	},
};
</script>

<style lang="stylus" scoped>

</style>
