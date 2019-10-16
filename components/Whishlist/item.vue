<template lang="html">
	<v-card>
		<div class="d-flex flex-no-wrap justify-space-between">
			<div>
				<v-card-title
					class="headline"
					v-text="post.item.title"
				/>

				<v-card-text>
					{{ post.item.price }}
				</v-card-text>
			</div>

			<v-avatar
				class="ma-3"
				size="125"
				tile
			>
				<v-img :src="post.item.img" />
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
