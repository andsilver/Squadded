<template>
	<section>
		<v-text-field
			ref="search-text"
			v-model="textValue"
			hide-details
			:placeholder="$t('Search')"
		>
			<v-icon slot="prepend" color="#B8B8BA" size="22">
				sqdi-magnifying-glass-finder
			</v-icon>
		</v-text-field>
		<div class="choose-items grid mt-2 poll-item">
			<ProductCard
				v-for="post in wishlist"
				:key="post.guid"
				:class="{ selected: post.selected }"
				:item="post.item"
				is-poll-post
				@click.native="() => select(post)"
			/>
		</div>
		<div class="selected-items grid mt-2">
			<span
				v-for="post in selected"
				:key="post.item.id"
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
	},
	data: () => ({
		textValue: '',
		selected: [],
	}),
	computed: {
		...mapState([
			'wishlist',
		]),
	},
	created () {
		return prefetch({
			guid: this.$route.params.id,
			store: this.$store,
			type: 'fetchWishlist',
		});
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
			this.selected = this.wishlist.filter(post => post.selected);
			this.$emit('select', this.selected);
			this.$forceUpdate();
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-input
	position sticky
	top 0
	z-index 2
.choose-items
	grid-template-columns 1fr 1fr
	grid-gap 10px
	max-height 490px
	overflow auto
	padding 2px

	.selected
		box-shadow 0 0 0 2px #000000;
.selected-items
	grid-template-columns repeat(4, 1fr);
	grid-gap 10px
	width 100%

.selected-item-img
	display inline-block
	border-radius 10px
	position relative
	.v-icon
		position absolute
		background-color #ffffff
		border 3px solid rgba(0, 0, 0, .2)
		border-radius 50%
		top calc(50% - 15px)
		left calc(50% - 15px)
		padding 6px
</style>
