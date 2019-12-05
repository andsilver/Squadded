<template>
	<v-container class="outfit-main-sec" v-if="socket.isAuth">
		<BackBar class="titlebar" ref="goback-button" :title="$t('Create')" />
		<Tabs />
		<v-layout column justify-center align-center class="tab-content-section">
			<div class="bottom-sticky">
				<SelectItems ref="select-items" :max-count="4" @select="select"/>
				<div class="merge-selected"  v-bind:class="{ OutfitSelected: (items.length > 0) }">
					<span v-if="items.length > 0">
						<div class="checkout-outfit">
							<span><img src="~assets/img/Avatar.png"></span>
							<v-text-field class="item-des see-selected" ref="text-field" v-model="text" :placeholder="$t('SelectOutfitName')" />
						</div>
					</span>
					<span v-if="items.length == 0" >
						<div class="choose-item" hide-details>choose 2 to 4 items to pair together</div>
					</span>
					<div class="bottom-post-sec">
						<div class="public-left-section">
							<div class="public-img"><img src="~assets/img/post.svg" alt="Squad brand logo" class="logo"/></div>
							<div class="pubic-text">
								<h4>Public</h4>
								<p>For everyone</p>
							</div>
						</div>
						<div class="public-right-section">
							<Button
								ref="done-button"
								class="mt-2"
								:disabled="!complete"
								@click.native="post"
							>
								{{ $t('Post') }}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Button from '~/components/common/Button';
import SelectItems from '~/components/Create/SelectItems';
import Tabs from '~/components/Create/Tabs';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';

export default {
	components: {
		BackBar,
		Button,
		SelectItems,
		Tabs,
	},
	data: () => ({
		text: '',
		items: [],
	}),
	computed: {
		...mapState([
			'socket',
		]),
		complete () {
			return !!(this.text && this.items.length >= 2 && this.items.length <= 4);
		},
	},
	methods: {
		select (items) {
			this.items = items.map(post => post.item);
		},
		async create () {
			const { items, text } = this;
			const msg = {
				items,
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

<style lang="scss" scoped>
.v-input{
	width:100%;
}
.outfit-main-sec h2.titlebar {
    color: #000;
    font-size: 4.307vw;
    font-weight: bold;
	text-align: center;
	padding-bottom: 5px;
}
.search-plus.v-text-field {
    padding-top: 5px;
    margin-top: 8px;
    padding-bottom: 0;
    margin-bottom: 14px !important;
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
.bottom-sticky .v-text-field input{
    font-weight: 600;
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
.titlebar .v-btn--icon.v-size--default {
    height: 20px;
    width: 20px;
    float: left;
}
.tab-content-section .choose-items {
    max-height: calc(100vh - 52vh) !important;
}
.merge-selected {
    position: fixed;
    min-height: 200px;
    width: 100%;
    z-index: 999;
    padding: 0;
    background: #fff;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: 3.446vw;
    text-align: center;
}
.merge-selected.OutfitSelected {
    min-height: 124px;
}
.choose-item {
    color: #B8B8BA;
    font-size: 3.384vw;
	font-weight: 500;
}
.bottom-post-sec {
    display: flex;
    align-items: center;
    width: 100%;
    position: absolute;
    bottom: 0;
    padding-bottom: 3.461vw;
}
.public-left-section {
    display: flex;
    align-items: center;
    width:50%;
    padding-left: 4.1538vw;
}
.public-right-section{
    width:50%;
    padding-right: 4.1538vw;
    text-align: right;
}
.public-img img {
    width: 11.846vw;
    height: auto;
}
.pubic-text {
    font-size: 3.230vw;
    text-align: left;
    color: #000000;
    font-weight: 700;
	padding-left: 2.153vw;
}
.pubic-text p {
    color: #B8B8BA;
    font-weight: 500;
	margin: 0 !important;
}
.bottom-post-sec button.mt-2.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default {
    height: 42px;
    min-width: 164px;
}
.bottom-sticky .selected-item-img .v-image__image.v-image__image--cover {
    width: 15.38vw;
    border-radius: 3.076vw;
}
i.v-icon.notranslate.sqdi.sqdi-close-cross.theme--light {
    color: rgba(0, 0, 0, 0.7);
    font-size: 8px !important;
}
/*selected outfit item css*/
.checkout-outfit .v-text-field__details {
    display: none;
}
.checkout-outfit {
    display: flex;
    align-items: center;
    background: #f4f4f5 !important;
    border-radius: 6.153vw;
    margin: 0 12px;
    padding: 1.538vw;
}
.checkout-outfit span {
    height: 8.307vw;
    padding-right: 1.538vw;
}
.checkout-outfit span img {
    width: 8.307vw;
    border-radius: 6.153vw;
}
.checkout-outfit .v-input.item-des.see-selected.theme--light.v-text-field.v-text-field--is-booted {
	padding: 0;
    margin: 0;
    background: transparent;
    font-size: 3.230vw;
    color: #000000;
    font-weight: 500;
}
</style>
