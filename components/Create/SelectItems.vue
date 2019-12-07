<template>
	<section>
		<div class="choose-items mt-2 poll-item" :class="{ grid: maxCount > 1 }">
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
		<div v-if="maxCount > 1" class="selected-items mt-2">
			<span
				v-for="post in selected"
				:key="post.item.itemId"
				class="selected-item-img"
			>
				<v-img
					:key="post.item.img"
					:src="post.item.img"
				/>
				<v-icon size="12" @click.native="() => unselect(post)">
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
	},
	data: () => ({
		selected: [],
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
				post.selected = !post.selected;
			}
			this.update();
		},
		unselect (post) {
			post.selected = false;
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
	grid-gap: 10px;
	max-height: 304px;
	overflow: auto;
	padding: 2px;
}
.selected{
	box-shadow:none;
}
.selected-item-img{
	display: inline-block;
	border-radius: 10px;
	position: relative;
	margin: 0 2.37vw 0 0;
	border: 2px dashed #DBDBDB;
	width: 15.384vw;
}
.selected-item-img .v-icon{
	border: 3px solid rgba(0,0,0,0.6);
    border-radius: 50%;
    top: calc(50% - 14px);
    left: calc(50% - 14px);
    padding: 5px;
    position: absolute;
    background: #fff;
}

</style>
