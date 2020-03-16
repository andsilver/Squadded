<template>
	<div class="pt-0">
		<SearchFriends ref="search-field" @change="(value) => searchText = value" />
		<div v-if="!searching" class="explore-content">
			<TopItems ref="top-items" class="explor-component" />
			<TopGallery ref="top-gallery" class="explor-component mt-4" />
			<EndingPolls ref="ending-polls" class="explor-component mt-4" />
			<TopOutfits ref="top-outfits" class="explor-component mt-4 mb-4" />
		</div>
		<div v-else-if="searchText.length > 2">
			<UserList v-if="friends && friends.length" ref="user-list" :show-follow="false" class="px-2" :users="friends" />
			<div v-else ref="no-result" class="pa-4">
				{{ $t('explore_page.search.no_results', { text: searchText }) }}
			</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import SearchFriends from '~/components/Explore/SearchFriends';
import TopItems from '~/components/Explore/TopItems';
import EndingPolls from '~/components/Explore/EndingPolls';
import TopGallery from '~/components/Explore/TopGallery';
import TopOutfits from '~/components/Explore/TopOutfits';
import UserList from '~/components/UserList';
import { ExploreStore } from '~/store/explore';

const { mapState } = createNamespacedHelpers(ExploreStore);

export default {
	name: 'ExplorePage',
	components: {
		SearchFriends,
		TopItems,
		EndingPolls,
		TopOutfits,
		TopGallery,
		UserList,
	},
	data: () => ({
		searchText: '',
	}),
	computed: {
		...mapState([
			'friends',
			'searching',
		]),
	},
	head: () => ({
		title: 'Main-Explore',
	}),
};
</script>

<style lang="stylus" scoped>
.explore-content
	padding 16px 0px 0 0px
</style>
