<template>
	<div v-if="item" class="item-details d-flex align-stretch pa-3">
		<img ref="item-image" class="item-image mr-3" :src="item.img" alt>
		<div class="flex-grow-1 d-flex flex-column pa-2 justify-space-between">
			<div>
				<div class="d-flex justify-space-between align-center">
					<span ref="item-price" class="item-price">{{ price }}</span>
					<button ref="buy-button" class="buy_button sqdi-shopping-bag-2 bag_inline" />
				</div>
				<div ref="item-title" class="mt-2">
					{{ item.title }}
				</div>
			</div>
			<div class="w-100 d-flex">
				<ResquaddButton ref="save-button" class="flex-grow-1" :item="item" />
				<Button ref="create-button" class="flex-grow-1 ml-2">
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
.item-details {
	position: relative;
}

.buy_button {
	width: 30px;
	height: 30px;
	position: absolute;
	right: 4%;
	bottom: 4%;

	&.bag_inline {
		top: 18px;
		bottom: auto;
	}
}

.item-title {
	min-height: 12px;
	max-height: 8.615vw;
	word-break: normal;
	overflow: hidden;
	font-size: 3.076vw;
	line-height: 4vw;
	font-weight: 500;
	color: #B8B8BA;
}

.sqdi-shopping-bag-2:before {
	width: 30px;
	position: absolute;
	font-size: 1.3em;
	left: auto;
	right: 0;
	top: 10%;
}

.item-price {
	font-size: 1em;
	font-weight: 700;
}

.item-image {
	width: 35%;
}
</style>
