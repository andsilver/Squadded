<template>
	<v-container class="feed-container px-1">
		<FakeTopBar ref="top-bar" class="topBar" @open-signin-dialog="openDialog" />
		<v-layout>
			<Feed
				ref="street-layout"
				:items="items"
				@mousedown.native="openDialog"
				@click.native="openDialog"
			/>
		</v-layout>
		<SignInDialog :show-dialog.sync="showDialog" />
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import FakeTopBar from '~/components/common/FakeTopBar';
import Feed from '~/components/Feed';
import { FeedPost } from '~/classes/FeedPost';
import { SquadAPI } from '~/services/SquadAPI';
import { DEFAULT_LANDING } from '~/store/squad';
import SignInDialog from '~/components/SignIn/SignInDialog';

export default {
	components: {
		FakeTopBar,
		Feed,
		SignInDialog,
	},
	data: () => ({
		items: null,
		unsubscribe: null,
		showStartWatchingDialog: false,
		showDialog: false,
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
		openDialog() {
			if (!this.socket.isAuth) {
				this.showDialog = true;
			}
		},
		async updateStreet () {
			const publicFeed = await SquadAPI.fetchStreet(this.merchant.id);
			if (!publicFeed) {
				// TODO show toast message or text placeholder
				return;
			}
			this.items = publicFeed.map(post => new FeedPost(post));
		},
	},
	head: () => ({
		title: 'Feed-Community',
	}),
};
</script>

<style lang="stylus" scoped>
.container.feed-container
	background #ececec
	margin-top 40px
</style>
