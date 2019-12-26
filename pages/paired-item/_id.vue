<template>
	<div v-if="item">
		<Topbar ref="topbar" />
		<ItemDetails ref="item-details" />
		<HesitatingUsers ref="hesitating-users" />
		<Posts ref="posts" />
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
	computed: {
		...mapState(['item']),
	},
	created() {
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
};
</script>
