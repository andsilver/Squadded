<template>
	<v-container v-if="socket.isAuth" class="outfit-main-sec">
		<BackBar ref="goback-button" :title="$t('Create')" />
		<Tabs />
		<v-layout column justify-center align-center class="tab-content-section">
			<v-text-field
				ref="search-text"
				v-model="searchText"
				class="search-plus"
				:hide-details="true"
				:placeholder="$t('Search')"
			>
				<v-icon slot="prepend" color="#B8B8BA" size="22">
					sqdi-magnifying-glass-finder
				</v-icon>
			</v-text-field>
			<SelectItems v-show="isWishlistHasItems" ref="select-items" :max-count="4" />
			<p v-if="isWishlistHasItems && getSelected.length === 0" class="tip-note">
				{{ $t('tip.outfitSelect') }}
			</p>
			<p v-if="!isWishlistHasItems" class="tip-note">
				{{ $t('wishlist.empty') }}
			</p>
			<p v-if="!isWishlistHasItems" class="tip-note">
				{{ $t('tip.addItems', [$t('an outfit')]) }}
			</p>
			<div class="merge-selected" :class="{ OutfitSelected: (getSelected.length > 0) }">
				<SelectedItems ref="selected-items" />
				<UserInput v-show="getSelected.length > 0" ref="text-field" v-model="text" :placeholder="$t('SelectOutfitName')" />
				<div class="bottom-post-sec">
					<PublicToggle ref="public-toggle" />
					<div class="public-right-section">
						<Button
							ref="done-button"
							class="mt-2"
							:disabled="!complete"
							@click.native="create"
						>
							{{ $t('Post') }}
						</Button>
					</div>
				</div>
			</div>
		</v-layout>
	</v-container>
</template>
<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Button from '~/components/common/Button';
import UserInput from '~/components/common/UserInput';
import PublicToggle from '~/components/Create/PublicToggle';
import SelectItems from '~/components/Create/SelectItems';
import SelectedItems from '~/components/Create/SelectedItems';
import Tabs from '~/components/Create/Tabs';
import { ActivityStore, ActivityGetters } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';

const { mapGetters } = createNamespacedHelpers(ActivityStore);

export default {
	components: {
		BackBar,
		Button,
		PublicToggle,
		SelectItems,
		SelectedItems,
		Tabs,
		UserInput,
	},
	data: () => ({
		searchText: '',
		text: '',
		isPublic: false,
	}),
	computed: {
		...mapGetters([
			ActivityGetters.getSelected,
		]),
		...mapState([
			'socket',
		]),
		complete () {
			return !!(this.text && this.getSelected.length >= 2 && this.getSelected.length <= 4);
		},
		isWishlistHasItems () {
			const { wishlist } = this.$store.state.activity;
			return wishlist && wishlist.length;
		},
	},
	methods: {
		async create () {
			const { text } = this;
			const { isPublic } = this.$refs['public-toggle'];
			const msg = {
				items: this.getSelected.map(post => post.item),
				private: !isPublic,
				text,
				type: 'outfitPost',
			};
			const post = await this.$store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
			this.$store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
			this.$router.push('/feed');
		},
	},
};
</script>

<style lang="css" scoped>
.search-plus.v-text-field {
	padding-top: 5px;
	margin-top: 8px;
	padding-bottom: 0;
	margin-bottom: 0px !important;
	font-size: 3.230vw;
	font-weight: 500;
}
i.v-icon.sqdi-magnifying-glass-finder {
	font-size: 4.69vw !important;
}
.search-plus .v-input__prepend-outer {
	margin-right: 0.615vw;
}
.search-plus.theme--light.v-input:not(.v-input--is-disabled) input {
	color: #B8B8BA;
}
.search-plus.v-text-field input {
	padding: 0px 2.153vw 0px!important;
	font-size: 3.80vw;
}
.search-plus.v-input {
	margin-bottom: 6.076vw;
}
.search-plus.v-input__append-outer,.search-plus.v-input__prepend-outer{
	margin-bottom: 0px;
	margin-top: 0px;
}
.tab-content-section .choose-items {
	max-height: calc(100vh - 52vh) !important;
}
.merge-selected {
	position: fixed;
	width: 100%;
	z-index: 999;
	padding: 0;
	background: #fff;
	bottom: 0;
	left: 0;
	right: 0;
}
.merge-selected.OutfitSelected {
	padding-top: 5px;
}
.tip-note {
	color: #B8B8BA;
	font-size: 3.384vw;
	font-weight: 500;
	margin-bottom: 0;
	margin-top: 5px;
}
.bottom-post-sec {
	display: flex;
	align-items: center;
	width: 100%;
	bottom: 0;
	padding: 3.461vw 4.1538vw;
}
.public-right-section{
	width:50%;
	padding-right: 4.1538vw;
	text-align: right;
}
.bottom-post-sec button.mt-2.v-btn.v-size--default {
	height: 42px;
	min-width: 100%;
}
</style>
