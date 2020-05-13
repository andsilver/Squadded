<template>
	<v-container class="feed-container">
		<FakeTopBar ref="top-bar" class="topBar" />
		<v-layout>
			<Feed
				ref="street-layout"
				:items="items"
				@mousedown.native="signin"
				@click.native="signin"
			/>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import FakeTopBar from '~/components/common/FakeTopBar.vue';
import Feed from '~/components/Feed';
import { FeedPost } from '~/classes/FeedPost';
import { SquadAPI } from '~/services/SquadAPI';
import { DEFAULT_LANDING } from '~/store/squad';

export default {
	components: {
		FakeTopBar,
		Feed,
	},
	data: () => ({
		items: null,
		unsubscribe: null,
		showStartWatchingDialog: false,
	}),
	computed: {
		...mapState([
			'merchant',
			'socket',
			'squad',
		]),
	},
	created () {
		if (this.squad.widget.open) {
			this.updateStreet();
			return;
		}
		this.$root.$once('widget-open', () => this.updateStreet());
	},
	mounted () {
		if (this.socket.isAuth) {
			this.$router.push(DEFAULT_LANDING);
		}
	},
	methods: {
		async updateStreet () {
			const publicFeed = await SquadAPI.fetchStreet(this.merchant.id);
			if (!publicFeed) {
				// TODO show toast message or text placeholder
				return;
			}
			this.items = publicFeed.map(post => new FeedPost(post));
		},
		signin () {
			if (!this.socket.isAuth) {
				this.$router.push('/');
			}
		},
	},
	head: () => ({
		title: 'Feed-Community',
	}),
};
</script>

<style lang="stylus" scoped>
.container.feed-container
	margin-top 55px
</style>
