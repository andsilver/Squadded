<template>
	<v-container>
		<div v-if="post" ref="poll-details">
			<Topbar :post="post" />
			<Status :post="post" />
			<Details :post="post" />
		</div>
	</v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Topbar from '~/components/PollDetails/Topbar';
import Status from '~/components/PollDetails/Status';
import Details from '~/components/PollDetails';
import { prefetch } from '~/helpers';
import { PostStore, PostGetters, PostMutations } from '~/store/post';

const { mapGetters } = createNamespacedHelpers(PostStore);

export default {
	name: 'PollDetailsPage',
	components: {
		Topbar,
		Status,
		Details,
	},
	computed: {
		...mapGetters({
			post: PostGetters.getPollResult,
		}),
	},
	created() {
		if (!this.$route.params.id) {
			history.back();
			return;
		}
		this.$store.commit(`${PostStore}/${PostMutations.setPollResult}`, null);
		prefetch({
			mutation: null,
			type: 'fetchPollResult',
			store: this.$store,
			pollPostId: this.$route.params.id,
		});
	},
};
</script>

<style lang='stylus' scoped>
h2
	color #000
	font-size 4.307vw
	font-weight bold
	text-align center
	padding-bottom 0px
	position relative
	line-height 36px
</style>
