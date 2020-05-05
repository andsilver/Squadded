<template>
	<section class="affiliate-links">
		<StepBack :title="$t('AffiliateLinks')" @back="done" />
		<v-layout column>
			<ItemLink
				v-for="post in getSelected"
				ref="item-link"
				:key="post.item.itemId"
				:item="post.item"
			/>
		</v-layout>
	</section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import ItemLink from '~/components/Create/ItemLink';
import StepBack from '~/components/common/StepBack';
import { ActivityStore, ActivityGetters } from '~/store/activity';

const { mapGetters } = createNamespacedHelpers(ActivityStore);

export default {
	components: {
		ItemLink,
		StepBack,
	},
	computed: {
		...mapGetters([
			ActivityGetters.getSelected,
		]),
	},
	methods: {
		done () {
			const links = this.$refs['item-link']
				.filter(link => !link.isError && link.item.url !== link.url);
			links.forEach((link) => {
				link.item.originurl = link.item.originurl || link.item.url;
				link.item.url = link.url;
			});
			this.$emit('done');
		},
	},
};
</script>

<style lang="stylus" scoped>
.affiliate-links
	position fixed
	width 100%
	height 100%
	padding 12px
	background-color white
	bottom 0
	left 0
	z-index 202
</style>
