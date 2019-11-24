<template>
	<v-container>
		<BackBar :title="$t('post.reactions')" />
		<v-layout v-if="post" flex-column>
			<div class="d-flex align-center">
				<UserLink :user="post.user" />
				<span>&nbsp;{{ $t('post.addedItem') }}</span>
			</div>
			<v-tabs
				v-model="tabs"
				class="px-1"
				fixed-tabs
				centered
			>
				<v-tab class="tabs pt-3">
					<span style="text-transform: capitalize;">Comments</span>
				</v-tab>
				<v-tab class="tabs pt-3">
					<span style="text-transform: capitalize">Likes</span>
				</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tabs">
				<v-tab-item>
					<Comments :post="post" />
				</v-tab-item>
				<v-tab-item>
					<Likes :post="post" />
				</v-tab-item>
			</v-tabs-items>
		</v-layout>
	</v-container>
</template>

<script>
import BackBar from '~/components/common/BackBar';
import Comments from '~/components/Comments';
import Likes from '~/components/Likes';
import UserLink from '~/components/UserLink';
import { FeedGetters, FeedStore } from '~/store/feed';

export default {
	name: 'PostReactions',
	components: {
		BackBar,
		Comments,
		Likes,
		UserLink,
	},
	data: () => ({
		post: null,
		tabs: null,
	}),
	created () {
		if (this.$route.hash === '#likes') {
			this.tabs = 1;
		}
		const { id } = this.$route.params;
		this.post = this.$store.getters[`${FeedStore}/${FeedGetters.getPostById}`](id);
	},
};
</script>

<style lang="stylus" scoped>

</style>
