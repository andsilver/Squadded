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
					class="purchase_button"
				>
					PURCHASE
				</v-btn>
			</div>

			<v-avatar
				class="mr-0"
				size="145"
				tile
			>
				<v-img :src="post.item.img" />
				<button class="double_heart_button">
					<img class="double_heart_icon" src="~assets/img/Icon.png">
				</button>
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
		margin: 5% 0;
	}

	.price {
		font-size: 1em;
		padding-left: 10%;
		padding-bottom: 3%;
	}

	.item_title {
		padding-top: 0;
		padding-left: 10%;
		padding-right: 10%;
		padding-bottom: 6%;

		font-size: 1em;
		line-height: 1em;
		color: #B8B8BA;
		word-break: normal;
	}

	.purchase_button {
		margin-bottom: 5%;
		margin-left: 10%;
		padding: 5% 22% !important;

		border-radius: 10px !important;
		background-color: black !important;
		color: white !important;

		font-size: .7em !important;
	}

	.double_heart_icon {
		margin-left: 20%;
		width: 60% !important;
		height: 60% !important
	}

	.double_heart_button {
		position: absolute;
		width: 25px;
		height: 25px;

		right: 5%;
		top: 5%;
		color: white;
		background-color: black;

		border-radius: 50%;
	}
</style>
