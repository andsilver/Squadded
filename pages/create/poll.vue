<template>
	<v-container v-if="socket.isAuth" class="poll-main-sec">
		<div :class="{ hide_section : !showOutfit }">
			<BackBar ref="goback-button" :title="$t('Create')" :close="showOutfit" />
			<Tabs />
			<v-layout column justify-center align-center class="tab-content-section">
				<SelectItems v-show="isWishlistHasItems" ref="select-items" :max-count="2" />
				<p v-if="isWishlistHasItems && !showError" class="tip-note">
					{{ $t('tip.pollSelect') }}
				</p>
				<p v-if="isWishlistHasItems && showError" class="tip-note error-note">
					{{ $t('tip.pollError') }}
				</p>
				<div v-else-if="!isWishlistHasItems" :class="{ empty_wishlist_container: !isWishlistHasItems}">
					<div class="whislist_empty">
						<div class="whish_img">
							<p>
								<img src="~assets/img/squad-logo-white.svg" class="insta-image">
							</p>
						</div>
						<div class="txt">
							<p ref="empty-whishlist-text" align="center">
								{{ $t('wishlist.postempty') }}
							</p>
							<Button class="flex-grow-1 wish_btn" @click.native="discoverItem">
								{{ $t('wishlist.discover') }}
							</Button>
						</div>
					</div>
				</div>
				<div v-show="isWishlistHasItems" class="merge-selected OutfitSelected">
					<SelectedItems ref="selected-items" is-poll />
					<Button
						class="mt-2 next-button"
						:class="{ disable_btn :!complete}"
						@click.native="next"
					>
						{{ $t('Next') }}
					</Button>
				</div>
			</v-layout>
		</div>
		<div :class="{ hide_section : showOutfit }" class="poll-main-sec">
			<v-layout column justify-center align-center class="tab-content-section">
				<h2>
					<v-btn ref="go-back-btn" icon @click="goBack">
						<v-icon>
							sqdi-arrow-pointing-to-left
						</v-icon>
					</v-btn>
					{{ $t('NewPoll') }}
				</h2>
				<UserInput v-show="getSelected.length > 0" ref="text-field" v-model="text" :placeholder="$t('SelectPollName')" class="input-section" />
				<PollView
					v-if="selectOFItems.length > 0"
					:post="selectOFItems"
				/>
				<Button
					class="edit-button"
					@click.native="goBack"
				>
					{{ $t('Edit') }}
				</Button>
				<div class="bottom-post-sec hide_section">
					<ExpirationPicker v-show="getSelected.length > 0" ref="expiration" class="poll-expiration" />
					<PublicToggle ref="public-toggle" :public="!user.me.private" />
				</div>
				<div class="public-right-section">
					<Button
						ref="done-button"
						class="mt-2 post-button"
						:disabled="!complete"
						@click.native="create"
					>
						{{ $t('Post') }}
					</Button>
				</div>
			</v-layout>
		</div>
	</v-container>
</template>
<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Button from '~/components/common/Button';
import UserInput from '~/components/common/UserInput';
import PollView from '~/components/common/PollView';
import PublicToggle from '~/components/Create/PublicToggle';
import SelectItems from '~/components/Create/SelectItems';
import SelectedItems from '~/components/Create/SelectedItems';
import Tabs from '~/components/Create/Tabs';
import ExpirationPicker from '~/components/Poll/ExpirationPicker';
import { ActivityStore, ActivityGetters } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';

const { mapGetters } = createNamespacedHelpers(ActivityStore);

export default {
	name: 'NewPollPage',
	components: {
		BackBar,
		Button,
		PublicToggle,
		SelectItems,
		SelectedItems,
		Tabs,
		UserInput,
		PollView,
		ExpirationPicker,
	},
	data: () => ({
		searchText: '',
		text: '',
		isPublic: false,
		showOutfit: true,
		showError: false,
		selectOFItems: {},
	}),
	computed: {
		...mapGetters([
			ActivityGetters.getSelected,
		]),
		...mapState([
			'socket',
			'user',
		]),
		complete () {
			return !!(this.getSelected.length >= 2 && this.getSelected.length <= 4);
		},
		isWishlistHasItems () {
			const { wishlist } = this.$store.state.activity;
			return wishlist && wishlist.length;
		},
	},
	created () {
		this.$root.$on('selectProducts', data => this.selectProducts(data));
	},
	methods: {
		async create () {
			const { text } = this;
			const { isPublic } = this.$refs['public-toggle'];
			const expires = this.$refs.expiration.expiration + Date.now();
			const items = this.getSelected.map(post => post.item);
			const item1 = items[0];
			const item2 = items[1];
			const msg = {
				item1,
				item2,
				private: !isPublic,
				text,
				expires,
				type: 'pollPost',
			};
			const post = await this.$store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
			this.$store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
			this.$router.push('/feed');
		},
		next () {
			if (this.getSelected.length < 2) {
				this.showError = true;
			} else {
				this.selectOFItems = this.getSelected.map(post => post.item);
				this.showError = false;
				this.showOutfit = false;
			}
		},
		goBack() {
			this.showOutfit = true;
		},
		selectProducts(options) {
			if (this.getSelected.length === 2 && !options) {
				this.showError = false;
			} else if (options) {
				this.showError = true;
			}
		},
		discoverItem() {
			this.$router.push('/explore');
		},
	},
	head: () => ({
		title: 'Create-Poll',
	}),
};
</script>

<style lang="css" scoped>
.hide_section {
	display: none;
}
.search-plus.v-text-field {
	padding-top: 0px;
	margin-top: 8px;
	padding-bottom: 0;
	margin-bottom: 8px !important;
	font-size: 3.230vw;
	font-weight: 500;
	width: 100%;
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
.search-plus.v-input__append-outer,.search-plus.v-input__prepend-outer{
	margin-bottom: 0px;
	margin-top: 0px;
}
.tab-content-section .choose-items {
	max-height: calc(100vh - 52vh) !important;
}
.show-tabs .merge-selected{
	position: fixed;
}
.merge-selected {
	width: 100%;
	z-index: 999;
	padding: 0;
	background: #fff;
	bottom: 0;
	left: 0;
	right: 0;
}
.merge-selected.OutfitSelected .next-button{
	margin-bottom: 6.15vw;
	display: block;
	height: 12.30vw;
}
.tip-note {
	font-size: 3.384vw;
	font-weight: 600;
	margin-bottom: 0;
	margin-top: 8px;
}
p.tip-note.error-note {
    color: #FD6256;
}
.bottom-post-sec {
	display: block;
	align-items: center;
	width: 100%;
	bottom: 0;
	padding: 4VW 0;
	margin-top: 4VW;
	border-top: 0.46vw solid #DBDBDB;
}
.public-right-section{
	width: 100%;
    text-align: center;
    bottom: 0px;
    background: #fff;
    z-index: 202;
    height: 25vw;
}
.show-tabs .public-right-section{
	position: fixed;
}
.bottom-post-sec button.mt-2.v-btn.v-size--default {
	height: 42px;
	min-width: 100%;
}
.next-button{
	color: #fff;
	width: 42.46vw;
}
.next-button.disable_btn{
	background-color: rgba(184,184,186,0.3) !important;
	height: 12.30vw;
}
.edit-button{
	background-image: url('~assets/img/refresh-icon.svg');
	background-color: transparent !important;
    width: 23.07vw;
    color: #000;
    border: 2px solid #000;
	font-size: 2.15vw;
	background-repeat: no-repeat;
    background-position: 4vw;
    padding-left: 10vw !important;
	background-size: 3.69vw;
}
.poll-main-sec h2{
	color: #000;
	font-size: 4.307vw;
	font-weight: bold;
	text-align: center;
	padding-bottom: 0px;
	position: relative;
	line-height: 36px;
	width: 100%;
}
.poll-main-sec h2 button{
	position: absolute;
	left: 0;
}
.post-button{
	width: 42.46vw;
	height: 12.30vw !important;
	margin-top: 6.50vw !important;
}
.whislist_empty{
    width: 82.15vw;
    margin: 0 auto 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.whislist_empty .whish_img{
	width: 53.53vw;
	height: 24.61vw;
	background: #F5F5F5;
	margin: 0 auto;
	position: relative;
}
.whislist_empty .whish_img p{
	position: absolute;
	right: 1.8vw;
	top: 1.8vw;
	background: #000000;
	border-radius: 50%;
	width: 10.76vw;
	height: 10.76vw;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0;
	z-index: 1;
}
.whislist_empty .whish_img:after{
	content: '';
	width: 15.38vw;
	height: 15.38vw;
	position: absolute;
	background: #B8B8BA;
	border-radius: 50%;
	z-index: 0;
	right: -0.5vw;
	top: -0.5vw;
}
.whislist_empty .whish_img:before{
	content: '';
	width: 23.07vw;
	height: 23.07vw;
	position: absolute;
	background: #DBDBDB;
	border-radius: 50%;
	z-index: 0;
	right: -4.3vw;
	top: -4.3vw;
}
.whislist_empty .whish_img p img{
	width: 6.15vw;
    height: 4.66vw;
}
.whislist_empty .txt p{
    font-size: 3.69vw;
    font-weight: 500;
    color: #000;
    width: 90%;
    margin: 6.87vw auto;
}
.whislist_empty .txt .wish_btn{
	margin: 0 auto;
	border: 0.461vw solid #000;
	height: 12.30vw;
	width: 46.92vw;
	font-size: 2.61vw;
	padding: 0 8px;
	display: block;
	font-weight: bold;
	border-radius: 3.07vw;
	text-transform: uppercase;
	margin-bottom: 3.07vw;
	letter-spacing: 2px;
	background-color: #fff !important;
	color: #000;
}
.empty_wishlist_container {
    width: 100%;
    height: calc(100vh - 90px);
    background-color: white;
    z-index: 202;
    position: fixed;
    bottom: 0;
	left: 0;
}
</style>
