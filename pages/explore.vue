<template>
	<div class="pt-0 flex-grow-1">
		<SearchFriends ref="search-field" @change="(value) => searchText = value" @typing="(v) => typing = v" />
		<div v-if="!searching" class="explore-content">
			<TopItems ref="top-items" class="explor-component" />
			<TopGallery ref="top-gallery" class="explor-component mt-4" />
			<EndingPolls ref="ending-polls" class="explor-component mt-4" />
			<TopOutfits ref="top-outfits" class="explor-component mt-4 mb-4" />
		</div>
		<template v-else>
			<template v-if="!loading && !typing">
				<div v-if="!friends" class="no-friend">
					{{ $t('invite_your_friends.search_users') }}
				</div>
				<div v-if="friends && !friends.length" ref="no-result" class="no-friend">
					{{ $t('explore_page.search.no_results', { text: searchText }) }}
				</div>
			</template>
			<div v-else-if="searchText.length > 2" class="no-friend d-flex align-center">
				<v-progress-circular size="14" width="2" indeterminate color="blue-grey" />
				<div class="ml-3">
					{{ $t('invite_your_friends.searching', { key: searchText }) }}
				</div>
			</div>
			<div v-else-if="searchText.length < 3" class="no-friend">
				{{ $t('invite_your_friends.search_users') }}
			</div>
			<UserList v-if="friends" ref="user-list" :show-follow="false" class="px-2" :users="friends" />
		</template>
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
import { ExploreStore, ExploreMutations } from '~/store/explore';

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
	asyncData ({ $isAuth, $isGuest, redirect }) {
		if (!$isAuth()) {
			redirect('/community');
		} else if ($isGuest()) {
			redirect('/all');
		}
	},
	data: () => ({
		searchText: '',
		typing: false,
	}),
	computed: {
		...mapState([
			'friends',
			'searching',
			'loading',
		]),
	},
	destroyed() {
		this.$store.commit(`${ExploreStore}/${ExploreMutations.setSearching}`, false);
		this.$store.commit(`${ExploreStore}/${ExploreMutations.setFriends}`, null);
	},
	methods: {
		onChange (text) {
			this.searchText = text;
		},
	},
	head: () => ({
		title: 'Main-Explore',
	}),
};
</script>

<style lang="stylus" scoped>
.explore-content
	padding 16px 0px 0 0px
.no-friend
	font-size 3.38vw
	color #B8B8BA
	font-weight 500
	margin-top 5.75vw
	margin-left 4.67vw;
</style>
