<template>
	<div v-if="item">
		<Topbar ref="topbar" :class="{paired_hide : pairedHide}" />
		<h3 v-if="pairedHide" class="d-flex align-center pa-2 backbar-sec">
			<v-btn ref="go-back-btn" icon @click="goBack">
				<v-icon>
					sqdi-arrow-pointing-to-left
				</v-icon>
			</v-btn>
			<span class="paired-item-title">{{ tabSelected }}</span>
		</h3>
		<ItemDetails ref="item-details" :class="{paired_hide : pairedHide}" />
		<HesitatingUsers ref="hesitating-users" :class="{paired_hide : pairedHide}" />
		<Posts ref="posts" :class="{paired_hide_sec : pairedHide}" />
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { PairedItemStore, PairedItemActions } from '~/store/paired-item';
import Topbar from '~/components/PairedItem/Topbar';
import ItemDetails from '~/components/PairedItem/ItemDetails';
import HesitatingUsers from '~/components/PairedItem/HesitatingUsers';
import Posts from '~/components/PairedItem/Posts';

const { mapState } = createNamespacedHelpers(PairedItemStore);

export default {
	name: 'PairedItemPage',
	components: {
		Topbar,
		ItemDetails,
		HesitatingUsers,
		Posts,
	},
	data: () => ({
		pairedHide: false,
		tabSelected: 'All',
	}),
	computed: {
		...mapState(['item']),
	},
	created() {
		this.$root.$on('postTaped', data => this.postTaped(data));
		this.$root.$on('tabChange', data => this.tabChange(data));
		const { varId, itemId, postId } = this.$route.query;

		if (!itemId || !postId) {
			history.back();
			return;
		}

		this.$store.dispatch(
			`${PairedItemStore}/${PairedItemActions.initPairedItem}`,
			{ varId, itemId, postId },
		);
	},
	methods: {
		postTaped(options) {
			this.pairedHide = true;
		},
		tabChange(options) {
			this.tabSelected = options;
		},
		goBack() {
			this.pairedHide = false;
			this.$root.$emit('postBack', '');
		},
	},
};
</script>
<style lang="stylus" scoped>
.paired_hide
	display none !important
.backbar-sec
	justify-content center
	position relative
	button
		position absolute
		left 6px
	.paired-item-title
		font-size 4.3vw
		height 36px
		line-height 36px
</style>
