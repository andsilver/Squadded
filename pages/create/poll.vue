<template>
	<v-container v-if="socket.isAuth" class="poll-main-sec">
		<BackBar ref="goback-button" :title="$t('Create')" />
		<Tabs />
		<v-layout column justify-center align-center>
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
			<div v-show="isWishlistHasItems" class="compare-two" :class="{'both_item_selected': item1 && item2 }">
				<SelectItems
					ref="select-item1"
					class="select-item"
					:max-count="1"
					is-poll
					:exclude="item2"
					@select="(items) => {item1 = items[0]}"
				/>
				<span class="com-vs">vs</span>
				<SelectItems
					ref="select-item2"
					class="select-item"
					:max-count="1"
					is-poll
					:exclude="item1"
					@select="(items) => {item2 = items[0]}"
				/>
			</div>
			<p v-if="isWishlistHasItems" class="tip-note">
				{{ $t('tip.pollSelect') }}
			</p>
			<p v-if="!isWishlistHasItems" class="tip-note">
				{{ $t('wishlist.empty') }}
			</p>
			<p v-if="!isWishlistHasItems" class="tip-note">
				{{ $t('tip.addItems', [$t('a poll')]) }}
			</p>
			<div class="merge-selected">
				<span class="poll-input" :class="{'showElement': item1 && item2 }">
					<div class="checkout-outfit">
						<span><img :src="avatar"></span>
						<v-text-field ref="text-field" v-model="text" :placeholder="$t('SelectPollName')" class="item-des see-selected" />
					</div>
				</span>
				<ExpirationPicker ref="expiration" class="poll-expiration" :class="{'showElement': item1 && item2 }" />
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
import { mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Button from '~/components/common/Button';
import PublicToggle from '~/components/Create/PublicToggle';
import SelectItems from '~/components/Create/SelectItems';
import Tabs from '~/components/Create/Tabs';
import ExpirationPicker from '~/components/Poll/ExpirationPicker';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';

export default {
	name: 'NewPollPage',
	components: {
		BackBar,
		Button,
		ExpirationPicker,
		PublicToggle,
		SelectItems,
		Tabs,
	},
	data: () => ({
		item1: null,
		item2: null,
		searchText: '',
		text: '',
	}),
	computed: {
		...mapState([
			'socket',
		]),
		complete () {
			return !!(this.text && this.item1 && this.item2);
		},
		avatar () {
			return this.$store.state.user.me.avatar;
		},
		isWishlistHasItems () {
			const { wishlist } = this.$store.state.activity;
			return wishlist && wishlist.length;
		},
	},
	methods: {
		async create () {
			const { item1, item2, text } = this;
			const { isPublic } = this.$refs['public-toggle'];
			const msg = {
				item1,
				item2,
				expires: this.$refs.expiration.date,
				private: !isPublic,
				text,
				type: 'pollPost',
			};
			const post = await this.$store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
			this.$store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
			this.$router.push('/feed');
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-input{
	width: 100%;
}
.compare-two{
	position: relative;
	padding: 14px 14px 0px;
    margin-left: -12px;
    margin-right: -12px;
    margin-top: 0px !important;
	display flex
	span{
		align-self: center
	}
	.select-item:first-child{
		margin-right 4.307vw
	}
	.select-item:last-child{
		margin-left 4.307vw
	}
	&::before{
		background: -moz-linear-gradient(top,  rgba(218,217,221,0.3) 0%, rgba(255,255,255,0) 100%);
		background: -webkit-linear-gradient(top,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%);
		background: linear-gradient(to bottom,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%);
		height:4.615vw;
		width:100%;
		content: '';
		left: 0;
		position: absolute;
		top: 0px;
	}
	&::after{
		background: -moz-linear-gradient(top,  rgba(255,255,255,0) 0%, rgba(218,217,221,0.3) 100%);
		background: -webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%);
		background: linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%);
		height:4.615vw;
		width:100%;
		content: '';
		left: 0;
		position: absolute;
		bottom: 0px;
	}
}
.select-item{
	width:46%;
}
.search-plus.v-text-field {
	padding-top: 5px;
	margin-top: 8px;
	padding-bottom: 0;
	margin-bottom: 0!important;
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
/*bottam sticky section */
.bottom-post-sec {
	display: flex;
	align-items: center;
	width: 100%;
	bottom: 0;
	padding-bottom: 3.461vw;
	padding-top: 10px;
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
i.v-icon.notranslate.sqdi.sqdi-close-cross.theme--light {
	color: rgba(0, 0, 0, 0.7);
	font-size: 8px !important;
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
	text-align: center;
}
.merge-selected.OutfitSelected {
	padding-top: 5px;
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
	height: 8.30vw;
}
.checkout-outfit .v-input.item-des.see-selected.theme--light.v-text-field.v-text-field--is-booted {
	padding: 0;
	margin: 0;
	background: transparent;
	font-size: 3.230vw;
	color: #000000;
	font-weight: 500;
}
.tip-note {
	color: #B8B8BA;
	font-size: 3.384vw;
	font-weight: 500;
	margin-bottom: 0;
	width: 100%;
	text-align: center;
	margin-top: 12px;
}
.com-vs{
	color: #000000;
    font-size: 4.307vw;
    font-weight: 500;
}
.poll-input, .poll-expiration {
	display: none;
}
span.poll-input.showElement, .poll-expiration.showElement {
	display: block;
}
.poll-expiration {
	margin-bottom: 10px;
}
</style>
