<template>
	<div
		ref="group"
		class="group"
		:style="{
			transform: `translateX(${transformX}px)`,
		}"
		:class="{ replacing	}"
	>
		<div
			v-for="(item, index) of post.items"
			ref="item"
			:key="index"
			class="item"
		>
			<ProductCard
				ref="product-card"
				class="mx-auto pa-4 w-78 mb-4 single-item"
				:item="item.item"
				show-refreshicon
				:loading="!item.guid && !item.error"
				:post-id="item.guid"
				:post="post.items[index]"
				:class="{ is_selected: index == selectedIndex }"
				group-post
			/>
		</div>
	</div>
</template>
<script>
import ProductCard from '~/components/Posts/Includes/ProductCard';

export default {
	components: {
		ProductCard,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		selectedItem: null,
		selectedIndex: 0,
		prevX: null,
		transformX: 0,
		replacing: false,
	}),
	computed: {
		selected() {
			return this.selectedItem || this.post.items[0];
		},
	},
	mounted () {
		this.$refs.group.addEventListener('touchstart', e => this.onStart(e));
		this.$refs.group.addEventListener('touchmove', e => this.onMove(e));
		this.$refs.group.addEventListener('touchend', e => this.onEnd(e));
	},
	methods: {
		onStart (e) {
			this.prevX = e.touches[0].clientX;
		},
		onMove (e) {
			e.preventDefault();

			if (this.replacing) {
				this.prevX = e.touches[0].clientX;
				return;
			}
			const { left, right } = this.$refs.group.getBoundingClientRect();

			if (left > 100) {
				this.setReplacing();
				this.transformX = 0;
				return;
			} else if (right < 300) {
				this.setReplacing();
				this.transformX += (350 - right);
			}
			const current = e.touches[0].clientX;
			this.transformX += (current - this.prevX);
			this.prevX = current;
		},
		onEnd (e) {
			const element = this.$refs.item[0];
			const { width } = element.getBoundingClientRect();
			let n = Math.abs(Math.round(this.transformX / width));

			if (n >= this.$refs.item.length) {
				n = this.$refs.item.length - 1;
			}
			this.transformX = -n * width;
			this.setReplacing(n);
			this.$emit('selected', n);
		},
		setReplacing (n) {
			this.replacing = true;
			setTimeout(() => {
				this.replacing = false;
				n !== undefined && (this.selectedIndex = n);
			}, 200);
		},
	},
};
</script>
<style lang="stylus" scoped>
.w-78
	width 62.906vw
	margin-right 3.07vw !important
.items-container
	display: flex
	overflow-x scroll
.group
	margin-left -12px
	margin-right -12px
	.item:last-child
		margin-right 80px !important
	.item:first-child
		margin-left 80px !important
.group
	display inline-flex
	transition transform linear
.replacing
	transition-duration .2s
</style>
