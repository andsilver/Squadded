<template>
	<section>
		<div class="choose-items-section" :class="{ is_poll_tab: isPoll }">
			<div class="choose-items mt-2 poll-item" :class="{ grid: maxCount > 1, no_item_selected: selected.length == 0 }">
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
		</div>
		<div v-if="maxCount > 1" class="selected-items mt-2">
			<span v-if="limitError">
				<div class="error-message">{{ $t('tip.limitMessage') }}</div>
			</span>
			<span
				v-for="post in selected"
				:key="post.item.itemId"
				class="selected-item-img"
				:class="{ showlimiterror: limitError }"
			>
				<v-img
					:key="post.item.img"
					:src="post.item.img"
				/>
				<v-icon size="1.84vw" @click.native="() => unselect(post)">
					sqdi-close-cross
				</v-icon>
			</span>
		</div>
	</section>
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
		maxCount: {
			type: Number,
			default: 2,
		},
		exclude: {
			type: Object,
			default: null,
		},
		isPoll: {
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
		this.wishlist.forEach(post => delete post.selected);
	},
	methods: {
		select (post) {
			if (this.selected.length < this.maxCount || this.selected.includes(post)) {
				this.limitError = false;
				post.selected = !post.selected;
			} else {
				this.limitError = true;
			}
			this.update();
		},
		unselect (post) {
			post.selected = false;
			this.limitError = false;
			this.update();
		},
		update () {
			this.selected = this.available.filter(post => post.selected);
			this.$emit('select', this.selected.map(post => post.item));
			this.$forceUpdate();
		},
	},
};
</script>

<style lang="scss" scoped>
.v-input{
	position: sticky;
	top: 0;
	z-index:2;
}
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
.selected-item-img{
	display: inline-block;
	border-radius: 3.076vw;
	position: relative;
	margin: 4.92vw 4.615vw 0 0;
	width: 15.384vw;
	overflow: hidden;
	height: 23.076vw;
}
.selected-items .v-responsive.v-image {
    height: 23.076vw;
}

.selected-item-img .v-icon{
	border: 1.538vw solid rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    top: calc(50% - 16px);
    left: calc(50% - 16px);
    position: absolute;
    color: #000000;
}
.search-plus {
	font-size: 3.230vw;
	font-family: 'Montserrat';
    color: #B8B8BA;
}
.sqdi-close-cross:before {
    content: '';
    width: 5.538vw;
    height: 5.538vw;
    background-color: #fff;
    text-align: center;
    line-height: 5.538vw;
    border-radius: 50%;
	background-image:url('~assets/img/close.svg');
	background-size: 8px;
    background-position: center;
    background-repeat: no-repeat;
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
