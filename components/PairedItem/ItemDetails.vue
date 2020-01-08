<template>
	<div v-if="item" class="item-details d-flex align-stretch pa-3">
		<img ref="item-image" class="item-image" :src="item.img" alt>
		<div class="flex-grow-1 d-flex flex-column pa-0 justify-space-between item-right-section">
			<div>
				<div class="d-flex justify-space-between align-center price-buy-sec">
					<span ref="item-price" class="item-price">{{ price }}</span>
					<button ref="buy-button" class="buy_button sqdi-shopping-bag-2 bag_inline" />
				</div>
				<div ref="item-title" class="item-title">
					{{ item.title }}
				</div>
			</div>
			<div class="w-100 d-flex">
				<ResquaddButton ref="save-button" class="flex-grow-1" :item="item" />
				<Button ref="create-button" class="flex-grow-1 ml-2 create-button">
					<v-icon class="plus-icon" x-small>
						sqdi-plus
					</v-icon>
					<span class="ml-2">{{ $t("Create") }}</span>
				</Button>
			</div>
		</div>
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import ResquaddButton from './Includes/ResquaddButton';
import Button from '~/components/common/Button';
import { price } from '~/helpers';
import { PairedItemStore } from '~/store/paired-item';

const { mapState } = createNamespacedHelpers(PairedItemStore);

export default {
	components: {
		Button,
		ResquaddButton,
	},
	computed: {
		...mapState(['item']),
		price() {
			return price(
				this.item.currency,
				this.item.price,
				this._i18n.locale,
			);
		},
		originPrice() {
			if (this.item && this.item.origPrice) {
				return price(
					this.item.currency,
					this.item.origPrice,
					this._i18n.locale,
				);
			} else {
				return '';
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.item-details
	position relative
.item-image
	width 32.30vw
	margin-right 4.15vw
.item-right-section
	.price-buy-sec
		margin-top 2.30vw
		.item-price
			font-size 4.30vw
			font-weight: 700
		.sqdi-shopping-bag-2:before
			position absolute
			font-size 1.3em
			left auto
			right 0
			top 10%
		.buy_button
			width 5.52vw
			height 6.76vw
			position absolute
			right 4%
			bottom 4%
			&.bag_inline
				top: 18px
				bottom: auto
	.item-title
		margin-top 1.84vw
		font-size 4.30vw
		line-height 5.84vw
		font-weight 500
		color #B8B8BA
</style>
