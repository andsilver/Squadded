<template>
	<v-card>
		<v-card-title>
			{{ $t('poll.dialogTitle') }}
		</v-card-title>
		<v-card-text>
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
			<section class="choose-items grid mt-2 poll-item">
				<ProductCard
					v-for="post in wishlist"
					:key="post.guid"
					:class="{ selected: post.selected }"
					:item="post.item"
					non-clickable
					@click.native="() => select(post)"
				/>
			</section>
		</v-card-text>
		<v-card-actions>
			<Button
				ref="done-button"
				:disabled="selected.length < 2"
				@click.native="done"
			>
				{{ $t('Choose') }}
			</Button>
		</v-card-actions>
	</v-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Button from '~/components/common/Button';
import ProductCard from '~/components/Posts/Includes/ProductCard';
import { prefetch } from '~/helpers';
import { ActivityStore } from '~/store/activity';

const { mapState } = createNamespacedHelpers(ActivityStore);

export default {
	components: {
		Button,
		ProductCard,
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
		done (e, data) {
			this.$emit('choose', this.selected);
		},
		select (post) {
			if (this.selected.length < 2 || this.selected.includes(post)) {
				post.selected = !post.selected;
			}
			this.selected = this.wishlist.filter(post => post.selected);
			this.$forceUpdate();
		},
	},
};
</script>

<style lang="stylus" scoped>
.choose-items
	grid-template-columns 1fr 1fr 1fr
	grid-gap 20px
	max-height 380px
	overflow auto
	padding 2px

	.selected
		box-shadow 0 0 0 2px #000000;
</style>
