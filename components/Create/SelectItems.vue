<template>
	<div class="choose-items-section" :class="{ is_poll_tab: isPoll }">
		<div class="choose-items mt-2 poll-item" :class="{ grid: !narrow && maxCount > 1, no_item_selected: selected.length == 0 }">
			<ProductCard
				v-for="post in available"
				ref="items"
				:key="post.guid"
				:class="{ selected: post.selected }"
				:item="post.item"
				is-poll-post
				@click.native="() => select(post)"
			/>
		</div>
		<p v-if="limitError" class="error-message">
			{{ $t('tip.limitMessage') }}
		</p>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import ProductCard from '~/components/Posts/Includes/ProductCard';
import { prefetch } from '~/helpers';
import { ActivityStore } from '~/store/activity';

const { mapState } = createNamespacedHelpers(ActivityStore);

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
	},
	data: () => ({
		selected: [],
		limitError: false,
	}),
	computed: {
		...mapState([
			'wishlist',
		]),
		available () {
			return this.wishlist && this.wishlist.filter(w => w.item !== this.exclude);
		},
	},
	created () {
		return prefetch({
			store: this.$store,
			type: 'fetchWishlist',
		});
	},
	destroyed () {
		this.wishlist.forEach(post => (post.selected = false));
	},
	methods: {
		select (post) {
			if (this.selected.length < this.maxCount || this.selected.includes(post)) {
				this.limitError = false;
				post.selected = !post.selected;
			} else {
				this.limitError = true;
			}
			this.selected = this.available.filter(post => post.selected);
			this.$emit('select', this.selected.map(post => post.item));
			this.$forceUpdate();
		},
	},
};
</script>

<style lang="scss" scoped>
.choose-items{
	grid-template-columns: 1fr 1fr;
	grid-gap: 20px;
	overflow: auto;
	background-color: transparent;
	margin-top: 0px !important;
}
.outfit-main-sec .choose-items, .compare-two.both_item_selected .choose-items{
	max-height: calc(100vh - 380px);
}
.outfit-main-sec .choose-items.no_item_selected, .choose-items.choose-items{
	max-height: calc(100vh - 250px);
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
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#dad9dd', endColorstr='#00ffffff',GradientType=0 );
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
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#dad9dd',GradientType=0 );
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
</style>
