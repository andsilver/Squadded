<template lang="html">
	<v-card class="wishlist_item">
		<div class="d-flex flex-no-wrap justify-space-between">
			<div>
				<v-card-text class="price">
					{{ post.item.price }}
				</v-card-text>
				<v-card-title
					class=" item_title"
					v-text="post.item.title"
				/>
				<v-btn
					class="purchase_button ml-4"
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
				<v-img :src="post.item.img" />
				<button class="double_heart_button sqdi-squadded-icon" />
			</v-avatar>
		</div>
	</v-card>
</template>

<script lang="js">
import { FeedPost } from '~/services/FeedPost';

export default {
	name: 'WhishlistItem',
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
};
</script>

<style>
	.wishlist_item {
		border-radius: 15px !important;
		overflow: hidden;
		margin: 3% 5%;

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
		margin-left: 10%;
		padding: 0 !important;
		padding-left: 30% !important;
		padding-right: 20% !important;

		border-radius: 10px !important;
		background-color: black !important;
		color: white !important;

		font-size: .55em !important;
		font-weight: 900;

		text-align: center;
	}

	.double_heart_button {
		position: absolute;
		width: 30px;
		height: 30px;

		right: 5%;
		top: 5%;
		color: white;
		background-color: black;
		border-radius: 50%;
	}

	.sqdi-squadded-icon:before {
		font-size: 1.15em !important;
		margin-left: 17%;
		margin-top: 1%;
	}

	.sqdi-shopping-bag-2:before {
		left: -30%;
		top: -10%;
		font-size: 1.8em;
		position: absolute;
	}

	.button_text {
		padding: 0 5%;
		padding-left: 2%;
	}
</style>
