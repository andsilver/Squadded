<template>
	<v-container v-if="socket.isAuth" class="outfit-main-sec">
		<div :class="{ hide_section : !showOutfit }">
			<BackBar ref="goback-button" :title="$t('Create')" :close="showOutfit" />
			<Tabs />
			<v-layout column justify-center align-center class="tab-content-section">
				<EmptyWishlist />
				<SelectItems ref="select-items" :max-count="4" :bottom-height="outfitBoxHeight" />
				<div ref="outfit-selected" class="merge-selected" :class="{ OutfitSelected: (selected.length > 0) }">
					<p v-if="!showError" class="tip-note">
						{{ $t('tip.outfitSelect') }}
					</p>
					<p v-if="showError" class="tip-note error-note">
						{{ $t('tip.outfitError') }}
					</p>
					<SelectedItems ref="selected-items" class="d-flex" />
					<Button
						ref="done-button"
						class="mt-2 next-button"
						:disabled="!complete"
						@click.native="next"
					>
						{{ $t('Next') }}
					</Button>
				</div>
			</v-layout>
		</div>
		<div :class="{ hide_section : showOutfit }" class="outfit-main-sec">
			<v-layout column justify-center align-center class="tab-content-section">
				<h2>
					<v-btn ref="go-back-btn" icon @click="goBack">
						<v-icon>
							sqdi-arrow-pointing-to-left
						</v-icon>
					</v-btn>
					{{ $t('NewOutfit') }}
				</h2>
				<UserInput v-show="selected.length > 0" ref="text-field" v-model="text" :placeholder="$t('SelectOutfitName')" class="input-section" />
				<OutfitView
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
					<PublicToggle v-if="!$isGuest()" ref="public-toggle" />
				</div>
				<div class="public-right-section">
					<Button
						ref="done-button"
						class="mt-2 post-button"
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
import OutfitView from '~/components/common/OutfitView';
import EmptyWishlist from '~/components/Create/EmptyWishlist';
import PublicToggle from '~/components/Create/PublicToggle';
import SelectItems from '~/components/Create/SelectItems';
import SelectedItems from '~/components/Create/SelectedItems';
import Tabs from '~/components/Create/Tabs';
import { GA_ACTIONS } from '~/consts';
import createPost from '~/mixins/create-post';

export default {
	components: {
		BackBar,
		Button,
		EmptyWishlist,
		PublicToggle,
		SelectItems,
		SelectedItems,
		Tabs,
		UserInput,
		OutfitView,
	},
	mixins: [createPost],
	data: () => ({
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
	watch: {
		async selected(next) {
			await this.$nextTick();
			this.outfitBoxHeight = this.$refs['outfit-selected'].clientHeight;
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
			const msg = {
				items: this.selected.map(post => post.item),
				private: this.$isGuest() ? false : !this.$refs['public-toggle'].isPublic,
				text,
				type: 'outfitPost',
			};
			this.createPost(msg);
			this.$gaAction(GA_ACTIONS.CREATE_POST_OUTFIT);
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
			if (this.selected.length >= 2 && !options) {
				this.showError = false;
			} else if (options) {
				this.showError = true;
			}
		},
	},
	head: () => ({
		title: 'Create-Outfit',
	}),
};
</script>

<style lang="css" scoped>
.hide_section {
	display: none;
}
.tab-content-section .choose-items {
	max-height: calc(100vh - 52vh) !important;
}
.merge-selected, .outfit_button_sec {
	width: 100%;
	z-index: 200;
	padding: 0;
	background: #fff;
	bottom: 0;
	left: 0;
	right: 0;
	position: fixed;
}
.show-tabs .merge-selected, .show-tabs .outfit_button_sec {
	position: fixed;
}

.outfit_button_sec{
	text-align: center;
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
	text-align: center;
}
p.tip-note.error-note {
    color: #FD6256;
}
.bottom-post-sec {
	display: flex;
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
    position: fixed;
    bottom: 0;
    background: #fff;
    z-index: 202;
    height: 25vw;
}
.bottom-post-sec button.mt-2.v-btn.v-size--default {
	height: 42px;
	min-width: 100%;
}
.next-button{
	color: #fff;
	width: 42.46vw;
	margin-bottom: 6.15vw;
	display: block;
	height: 12.30vw !important;
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
.outfit-main-sec h2{
	color: #000;
	font-size: 4.307vw;
	font-weight: bold;
	text-align: center;
	padding-bottom: 0px;
	position: relative;
	line-height: 36px;
	width: 100%;
}
.outfit-main-sec h2 button{
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
</style>
