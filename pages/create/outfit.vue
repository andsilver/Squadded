<template>
	<v-container v-if="socket.isAuth">
		<BackBar ref="goback-button" :title="$t('Create')" />
		<Tabs />
		<v-layout
			column
			justify-center
			align-center
		>
			<SelectItems ref="select-items" :max-count="4" @select="select" />
			<v-text-field
				ref="text-field"
				v-model="text"
				hide-details
				:placeholder="$t('poll.textPlaceholder')"
			/>
			<Button
				ref="done-button"
				:disabled="!complete"
				@click.native="create"
			>
				{{ $t('Create') }}
			</Button>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Button from '~/components/common/Button';
import SelectItems from '~/components/Create/SelectItems';
import Tabs from '~/components/Create/Tabs';
import { FeedStore, FeedActions } from '~/store/feed';

export default {
	components: {
		BackBar,
		Button,
		SelectItems,
		Tabs,
	},
	data: () => ({
		text: '',
		items: [],
	}),
	computed: {
		...mapState([
			'socket',
		]),
		complete () {
			return !!(this.text && this.items.length >= 2 && this.items.length <= 4);
		},
	},
	methods: {
		select (items) {
			this.items = items.map(post => post.item);
		},
		create () {
			const { items, text } = this;
			this.$store.dispatch(`${FeedStore}/${FeedActions.saveItem}`, {
				items,
				text,
				type: 'outfitPost',
			});
			this.$router.push('/feed');
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-input
	width 100%
</style>
