<template>
	<section class="feed">
		<template
			v-for="post in items"
		>
			<SingleItemPost
				v-if="post.type === 'singleItemPost'"
				:key="post.correlationId || post.guid"
				:post="post"
			/>
			<PollPost
				v-else-if="post.type === 'pollPost'"
				:key="post.correlationId || post.guid"
				:post="post"
			/>
		</template>
	</section>
</template>

<script>
import SingleItemPost from '~/components/Posts/SingleItemPost';
import PollPost from '~/components/Posts/PollPost';

export default {
	name: 'Feed',
	components: {
		SingleItemPost,
		PollPost,
	},
	props: {
		items: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>
