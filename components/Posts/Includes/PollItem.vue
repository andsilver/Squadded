<template>
	<div class="poll-item">
		<ProductCard
			ref="product-card"
			:item="item"
		/>
	</div>
</template>

<script>
import ProductCard from './ProductCard';

export default {
	name: 'PollItem',
	components: {
		ProductCard,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
};
</script>
