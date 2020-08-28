<template>
	<div style="width: 100%">
		<v-text-field
			ref="search-text"
			v-model="searchText"
			class="search-plus"
			:class="{'for-photo': isPhoto, 'normal': !isPhoto}"
			:hide-details="true"
			:placeholder="$t('Search')"
			clearable
		>
			<v-icon slot="prepend" color="#B8B8BA" size="22">
				sqdi-magnifying-glass-finder
			</v-icon>
		</v-text-field>
		<div
			class="choose-items-section"
			:class="{ is_poll_tab: isPoll }"
			:style="{
				'margin-bottom': marginBottom,
			}"
		>
			<div ref="items" class="choose-items mt-2 poll-item" :class="{ grid: !narrow && maxCount > 1, no_item_selected: selected.length == 0 }">
				<ProductCard
					v-for="post in available"
					ref="item"
					:key="post.guid"
					:class="{ selected: post.selected }"
					:item="post.item"
					is-poll-post
					@click.native="() => select(post)"
				/>
			</div>
			<!-- <p v-if="limitError" class="error-message">
				{{ $t('tip.limitMessage') }}
			</p> -->
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import ProductCard from '~/components/Posts/Includes/ProductCard';
import { prefetch } from '~/helpers';
import { ActivityStore, ActivityGetters } from '~/store/activity';

const { mapState, mapGetters } = createNamespacedHelpers(ActivityStore);

export default {
	components: {
		ProductCard,
	},
	props: {
		exclude: {
			type: Object,
			default: null,
		},
		isPoll: {
			type: Boolean,
			default: false,
		},
		maxCount: {
			type: Number,
			default: 2,
		},
		narrow: {
			type: Boolean,
			default: false,
		},
		isPhoto: {
			type: Boolean,
			default: false,
		},
		coords: {
			type: Array,
			default: () => [],
		},
		bottomHeight: {
			type: Number,
			default: 0,
		},
	},
	data: () => ({
		selected: [],
		limitError: false,
		searchText: '',
	}),
	computed: {
		...mapState([
			'wishlist',
		]),
		...mapGetters([
			ActivityGetters.getSelected,
		]),
		available () {
			let available = (this.wishlist || []).filter(w => w.item !== this.exclude);
			if (this.searchText) {
				available = available.filter(w => w.item.title.toLowerCase().includes(this.searchText.toLowerCase()));
			}
			const ids = new Set(available.map(p => p.item.itemId));
			available = Array.from(ids).map(id => available.find(p => p.item.itemId === id));
			return available;
		},
		marginBottom() {
			return this.bottomHeight ? `${this.bottomHeight}px` : (this.selected && this.selected.length) || this.maxCount === 2 ? '200px' : '90px';
		},
	},
	watch: {
		getSelected (value) {
			this.selected = this.selected.filter(c => value.find(s => s.postId === c.postId));
		},
	},
	created () {
		if (this.$store.state.pairedItem && this.$store.state.pairedItem.item) {
			this.selectPaired(this.$store.state.pairedItem.item.itemId);
		}
		return prefetch({
			store: this.$store,
			type: 'fetchWishlist',
		});
	},
	destroyed () {
		this.wishlist && this.wishlist.forEach(post => (post.selected = false));
	},
	methods: {
		selectPaired(itemId) {
			const selectedPairedPost = this.available && this.available.find(i => i.item.itemId === itemId);
			if (selectedPairedPost) {
				this.select(selectedPairedPost);
			}
		},
		select (post) {
			if (!post.selected) {
				if (this.selected.length >= this.maxCount) {
					this.limitError = true;
					this.$root.$emit('selectProducts', this.limitError);
					return;
				} else if (this.coords.length <= this.selected.length && this.isPhoto) {
					return;
				}
			}
			this.limitError = false;
			post.selected = !post.selected;
			this.selected = this.available.filter(post => post.selected);
			this.$emit('select', this.selected.map(post => post.item), post.postId);
			this.$root.$emit('selectProducts', this.limitError);
			this.$forceUpdate();
		},
		tagClick (coord) {
			let index = this.available.findIndex(item => item.postId === coord.id);
			if (index === -1) {
				index = 0;
			}
			const item = this.$refs.item[index];
			return item.$el.offsetTop - 64;
		},
	},
};
</script>

<style lang="stylus" scoped>
.choose-items{
	grid-template-columns: 1fr 1fr;
	grid-gap: 20px;
	overflow-y: auto;
	overflow-x: hidden;
	background-color: transparent;
	margin-top: 0px !important;
	max-height: 100%;
}
.show-tabs .outfit-main-sec .choose-items.no_item_selected
	max-height calc(100vh - 260px)
.video-main-sec .choose-items
	max-height calc(100vh - 335px)
.video-main-sec .choose-items.no_item_selected
	max-height calc(100vh - 236px)

.selected >>> .v-responsive__content{
	box-shadow: none;
	background-image:url('~assets/img/selected.svg');
	background-size: 21.692vw;
	height: auto;
	background-position: center;
	&:after{
		opacity: 1;
	}
}
.choose-items-section{
	position: relative;
	padding: 14px 14px 0px;
	margin-left: -12px;
	margin-right: -12px;
	margin-top: 0px !important;
}
.choose-items-section.is_poll_tab {
	padding: 0;
	margin: 0;
	position: initial;
}
.choose-items-section::before{
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
.choose-items-section::after{
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
.choose-items-section.is_poll_tab::before, .choose-items-section.is_poll_tab::after{
	background: none;
}
.selected{
	box-shadow:none;
}
.error-message {
	color: #B8B8BA;
	font-size: 3.384vw;
	font-weight: 500;
	text-align: center;
}
.selected-item-img.showlimiterror {
	margin: 0vw 4.615vw 0 0;
}
.photo-create .choose-items-section{
	margin-left: 0px;
	margin-right: 0px;
	padding: 18px 18px 0px;
	overflow: auto;
}
.photo-create .error-message{
	display: none;
}
.photo-main-sec .choose-items-section::before, .choose-items-section::after{
	background: none;
	height: 0;
}
.search-plus.normal {
	&.v-text-field {
		padding-top: 0px;
		margin-top: 8px;
		padding-bottom: 0;
		font-size: 3.230vw;
		font-weight: 500;
		width: 100%;
	}
	.v-input__prepend-outer {
		margin-right: 0.615vw;
	}
	&.v-input__append-outer, &.v-input__prepend-outer{
		margin-bottom: 0px;
		margin-top: 0px;
	}
	&.theme--light.v-input:not(.v-input--is-disabled) input {
		color: #B8B8BA;
	}
	&.v-text-field input {
		padding: 0px 2.153vw 0px!important;
		font-size: 3.80vw;
	}
	i.v-icon.sqdi-magnifying-glass-finder {
		font-size: 4.69vw !important;
		color: black !important;
	}
	.v-input__icon.v-input__icon--clear {
		background: black !important;
	}
	.v-input__control .v-input__append-inner .v-input__icon--clear{
		background: black !important;

		.v-icon{
			color: white;
			font-size: 16px;
		}
	}
}

.search-plus.for-photo {
	padding: 2px 18px 5px;
	font-size: 3.23vw;
	position: absolute;
	top: 0;
	width: 100%;
	background-color: transparent;
}
.photo-selected {
    overflow-y: auto;
}
</style>
