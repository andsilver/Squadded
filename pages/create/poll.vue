<template>
	<v-container v-if="socket.isAuth" class="poll-main-sec">
		<div :class="{ hide_section : !showOutfit }">
			<BackBar ref="goback-button" :title="$t('Create')" :close="showOutfit" />
			<Tabs />
			<v-layout column justify-center align-center class="tab-content-section">
				<EmptyWishlist />
				<SelectItems ref="select-items" :max-count="2" :bottom-height="outfitBoxHeight" />
				<div ref="outfit-selected" class="merge-selected OutfitSelected px-3">
					<p v-if="!showError" class="tip-note">
						{{ $t('tip.pollSelect') }}
					</p>
					<p v-if="showError" class="tip-note error-note">
						{{ $t('tip.pollError') }}
					</p>
					<SelectedItems ref="selected-items" class="d-flex" is-poll />
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
			<v-layout
				column
				justify-center
				align-center
				class="tab-content-section"
				justify-space-between
				fill-height
			>
				<v-layout column align-center>
					<h2>
						<v-btn ref="go-back-btn" icon @click="goBack">
							<v-icon>
								sqdi-arrow-pointing-to-left
							</v-icon>
						</v-btn>
						{{ $t('NewPoll') }}
					</h2>
					<UserInput v-show="selected.length > 0" ref="text-field" v-model="text" :placeholder="$t('SelectPollName')" class="input-section" />
					<PollView
						v-if="selectOFItems.length > 0"
						:post="selectOFItems"
					/>
					<Button
						class="edit-button"
						style="width:26.46vw;"
						@click.native="goBack"
					>
						{{ $t('Edit') }}
					</Button>
					<div class="bottom-post-sec hide_section">
						<ExpirationPicker v-show="selected.length > 0" ref="expiration" class="poll-expiration" />
						<PublicToggle v-if="!$isGuest()" ref="public-toggle" />
					</div>
				</v-layout>
				<div class="public-right-section">
					<Button
						ref="done-button"
						class="post-button"
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
import BackBar from '~/components/Create/BackBar';
import Button from '~/components/common/Button';
import UserInput from '~/components/common/UserInput';
import PollView from '~/components/common/PollView';
import EmptyWishlist from '~/components/Create/EmptyWishlist';
import PublicToggle from '~/components/Create/PublicToggle';
import SelectItems from '~/components/Create/SelectItems';
import SelectedItems from '~/components/Create/SelectedItems';
import Tabs from '~/components/Create/Tabs';
import ExpirationPicker from '~/components/Poll/ExpirationPicker';
import { GA_ACTIONS } from '~/consts';
import createPost from '~/mixins/create-post';

export default {
	name: 'NewPollPage',
	components: {
		BackBar,
		Button,
		EmptyWishlist,
		PublicToggle,
		SelectItems,
		SelectedItems,
		Tabs,
		UserInput,
		PollView,
		ExpirationPicker,
	},
	mixins: [createPost],
	data: () => ({
		searchText: '',
		text: '',
		isPublic: false,
		showOutfit: true,
		showError: false,
		selectOFItems: {},
		outfitBoxHeight: 0,
	}),
	computed: {
		complete () {
			return !!(this.selected.length >= 2 && this.selected.length <= 4);
		},
	},
	created () {
		this.$root.$on('selectProducts', data => this.selectProducts(data));
	},
	mounted() {
		this.outfitBoxHeight = this.$refs['outfit-selected'].clientHeight;
	},
	methods: {
		create () {
			const { text } = this;
			const expires = this.$refs.expiration.expiration + Date.now();
			const items = this.selected.map(post => post.item);
			const item1 = items[0];
			const item2 = items[1];
			const msg = {
				item1,
				item2,
				private: this.$isGuest() ? false : !this.$refs['public-toggle'].isPublic,
				text,
				expires,
				type: 'pollPost',
			};
			this.createPost(msg);
			this.$gaAction(GA_ACTIONS.CREATE_POST_POLL);
		},
		next () {
			if (this.selected.length < 2) {
				this.showError = true;
			} else {
				this.selectOFItems = this.selected.map(post => post.item);
				this.showError = false;
				this.showOutfit = false;
			}
		},
		goBack() {
			this.showOutfit = true;
		},
		selectProducts(options) {
			if (this.selected.length === 2 && !options) {
				this.showError = false;
			} else if (options) {
				this.showError = true;
			}
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
.show-tabs .merge-selected{
	position: fixed;
}
.merge-selected {
	width: 100%;
	z-index: 200;
	padding: 0;
	background: #fff;
	bottom: 0;
	left: 0;
	right: 0;
	position: fixed;
}
.merge-selected.OutfitSelected .next-button{
	margin-bottom: 4.15vw;
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
	margin-top: 4VW;
	border-top: 0.46vw solid #DBDBDB;
}
.public-right-section{
	width: 100%;
    text-align: center;
    bottom: 0px;
    background: #fff;
    z-index: 202;
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
.poll-main-sec {
	height: 100%;
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
@media screen and (max-width: 280px) {
	.edit-button {
		width: 29.46vw !important;
	}
}
.input-section {
	flex: 0;
}
</style>
