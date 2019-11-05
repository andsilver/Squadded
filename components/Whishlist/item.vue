<template lang="html">
	<v-card class="wishlist_item">
		<div class="d-flex">
			<div class="flex-grow-1">
				<v-card-text ref="item-price" class="price" @click="openProduct">
					{{ post.item.price }}
				</v-card-text>
				<v-card-title
					ref="item-title"
					class=" item_title"
					@click="openProduct"
					v-text="post.item.title"
				/>
				<v-btn
					class="purchase_button"
				>
					<span class="button_text sqdi-shopping-bag-2">{{ $t('wishlist.purchase') }}</span>
				</v-btn>
			</div>
			<v-avatar
				class="mr-0 post_image"
				size="120"
				height="120"
				tile
			>
				<v-img ref="item-image" :src="post.item.img" @click="openProduct" />
				<ReSquaddButton
					:item="post.item"
				/>
			</v-avatar>
		</div>
	</v-card>
</template>

<script>
import ReSquaddButton from '~/components/ReSquaddButton';
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
	methods: {
		openProduct () {
			SquadAPI.openProduct(this.post.item);
		},
	},
};
</script>

<style>
	.wishlist_item {
		border-radius: 15px !important;
		overflow: hidden;
		margin: 3% 1%;

		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	}

	.price {
		font-size: .9em;
		font-weight: 700;
		padding-left: 10%;
		padding-bottom: 1%;
		padding-top: 2%;
	}

	.item_title {
		font-weight: 400;
		padding-top: 0;
		padding-bottom: 0;
		padding-left: 10%;
		padding-right: 10%;
		margin-top: 1%;

		max-height: 34px;
		overflow: hidden;

		font-size: .8em;
		line-height: 1.3em;
		color: #B8B8BA;
		word-break: normal;
	}

	.purchase_button {
		margin-top: 5%;
		margin-left: 50%;
		transform: translateX(-50%);
		padding: 0 !important;
		padding-left: 35% !important;
		padding-right: 25% !important;

		border-radius: 10px !important;
		background-color: black !important;
		color: white !important;

		font-size: .55em !important;
		font-weight: 900;

		text-align: center;
	}

	.sqdi-shopping-bag-2:before {
		left: -40%;
		top: -10%;
		font-size: 1.8em;
		position: absolute;
	}

	.button_text {
		padding: 0 5%;
		padding-left: 2%;
	}
</style>
