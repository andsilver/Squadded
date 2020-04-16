<template lang="html">
	<v-card class="wishlist_item">
		<div class="d-flex">
			<v-avatar
				class="mr-0 post_image"
				size="23.07vw"
				height="35.38vw"
				tile
			>
				<v-img
					ref="item-image"
					:key="post.item.img"
					:src="post.item.img"
					@click="openProduct"
				/>
			</v-avatar>
			<div class="flex-grow-1">
				<ReSquaddButton :item="post.item" class="remove-button wishlist-remove" />
				<v-card-title
					ref="item-title"
					class=" item_title"
					@click="openProduct"
				>
					<div class="merchant-id" @click="openProduct">
						{{ post.item.merchantId || post.merchantId }}
					</div>
					<div>{{ post.item.title }}</div>
				</v-card-title>
				<div class="reaction-sec">
					<v-icon
						ref="likes-icon"
						class="buttons_icon icon-mr"
						color="#B8B8BA"
						size="3.38vw"
					>
						sqdi-favorite-heart-button-outline
					</v-icon>
					<span class="icon-count">128</span>
					<v-icon
						ref="likes-icon"
						class="buttons_icon chat-icon icon-mr"
						color="#B8B8BA"
						size="3.38vw"
					>
						sqdi-chat-outlined
					</v-icon>
					<span class="icon-count">14</span>
					<img src="~assets/img/refresh-grey.svg" class="refresh-logo icon-mr">
					<span class="icon-count">1,459</span>
				</div>
				<div class="price-btn-sec">
					<v-card-text ref="item-price" class="price" @click="openProduct">
						{{ price }}
					</v-card-text>
					<v-btn
						class="purchase_button"
						@click="openProduct"
					>
						<span class="button_text sqdi-shopping-bag-2">{{ $t('wishlist.purchase') }}</span>
					</v-btn>
				</div>
			</div>
		</div>
	</v-card>
</template>

<script>
import ReSquaddButton from '~/components/ReSquaddButton';
import { price } from '~/helpers';
import { FeedPost } from '~/classes/FeedPost';
import { SquadAPI } from '~/services/SquadAPI';

export default {
	name: 'WhishlistItem',
	components: {
		ReSquaddButton,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
	computed: {
		price () {
			return price(this.post.item.currency, this.post.item.price, this._i18n.locale);
		},
	},
	methods: {
		openProduct () {
			SquadAPI.openProduct(this.post.item);
		},
	},
};
</script>

<style>
	.merchant-id {
		font-size: 3.1vw;
		font-weight: 600;
		color: #B8B8BA;
		text-transform: uppercase;
	}

	.wishlist_item {
		border-radius: 3.07vw !important;
		overflow: hidden;
		margin: 3.07vw 0;
		box-shadow: 0 0.92vw 6.15vw rgba(0,0,0,0.1);
	}

	.price {
		font-size: 4VW;
		font-weight: 700;
		padding: 0;
	}

	.item_title {
		font-weight: 400;
		padding-top: 0;
		padding-bottom: 0;
		padding-right: 4.46vw;
		margin-top: 3.46vw;
		max-height: 46px;
		overflow: hidden;
		font-size: 3.69vw;
		line-height: 4.30vw;
		color: #000000;
		margin-bottom: 2.07vw;
		word-break: normal;
		width: 83%;
		margin-right: 0;
		padding-right: 0;
		min-height: 8.5vw;
	}

	.purchase_button {
		width: 33.84vw;
		border-radius: 3.07vw !important;
		background-color: transparent !important;
		color: #000 !important;
		font-size: 2.15vw !important;
		font-weight: 700;
		text-align: center;
		box-shadow: none;
		border: 0.461vw solid #000;
		letter-spacing: 1.5px;
		position: relative;
		height: 8.46vw !important;
		padding-left: 9.84vw !important;
	}

	.sqdi-shopping-bag-2:before {
		left: -18px;
		top: -15%;
		font-size: 3.38vw;
		position: absolute;
	}

	.button_text {
		padding: 0 5%;
		padding-left: 2%;
	}

	.price-btn-sec {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 4.46vw;
		margin-bottom: 3.46vw;
	}
	.reaction-sec {
		margin: 0px 4.46vw 3vw;
	}
	.icon-mr {
		margin-right: 0.6vw;
	}
	.icon-count {
		font-size: 3.23vw;
		color: #B8B8BA;
		margin-right: 4.61vw;
	}
	img.refresh-logo {
		width: 3.38vw;
		vertical-align: middle;
	}
</style>
