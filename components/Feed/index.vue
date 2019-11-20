<template>
	<section class="feed">
		<template
			v-for="post in items"
		>
			<component
				:is="getComponent(post)"
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
	methods: {
		getComponent (post) {
			return post.type === 'singleItemPost' ? SingleItemPost
				: post.type === 'pollPost' ? PollPost
				: null;
		},
	},
};
</script>

<style lang="stylus" scoped>
.feed
	width 100%
</style>
