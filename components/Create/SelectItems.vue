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
			<span v-if="limitError">
				<div class="error-message">{{ $t('limitMessage') }}</div>
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
	grid-gap: 10px;
	max-height: calc(100vh - 380px);
	overflow: auto;
	padding: 2px;
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
    content: '\0048';
    width: 5.538vw;
    height: 5.538vw;
    background-color: #fff;
    text-align: center;
    line-height: 5.538vw;
    border-radius: 50%;
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
