<template>
	<v-container class="feed-container px-1">
		<FakeTopBar ref="top-bar" class="topBar" />
		<v-layout>
			<Feed
				ref="street-layout"
				:items="showHome ? posts : items"
				@mousedown.native="openDialog"
				@click.native="openDialog"
			/>
		</v-layout>
		<SignInDialog :show-dialog.sync="showDialog" />
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import FakeTopBar from '~/components/common/FakeTopBar';
import Feed from '~/components/Feed';
import { FeedPost } from '~/classes/FeedPost';
import { SquadAPI } from '~/services/SquadAPI';
import { DEFAULT_LANDING } from '~/store/squad';
import { HomeStore, HomeActions } from '~/store/home';
import SignInDialog from '~/components/SignIn/SignInDialog';
import { UserStore } from '~/store/user';
import { PostStore, PostMutations } from '~/store/post';

const userState = createNamespacedHelpers(UserStore).mapState;
const homeState = createNamespacedHelpers(HomeStore).mapState;

export default {
	components: {
		FakeTopBar,
		Feed,
		SignInDialog,
	},
	asyncData({ store, redirect }) {
		if (store.state.socket.isAuth) {
			if (store.state.user.me.guest) {
				redirect('/all');
			} else {
				redirect(DEFAULT_LANDING);
			}
		}
	},
	data: () => ({
		items: null,
		unsubscribe: null,
		showStartWatchingDialog: false,
		showDialog: false,
		showHome: false,
		subscription: null,
	}),
	computed: {
		...mapState([
			'merchant',
			'socket',
			'squad',
		]),
		...userState([
			'me',
		]),
		...homeState([
			'posts',
		]),
	},
	created () {
		this.subscription = this.$store.subscribe((mutation, state) => {
			switch (mutation.type) {
			case `${PostStore}/${PostMutations.setPostLike}`: {
				setTimeout(() => {
					const { guid, ...likes } = mutation.payload;
					const index = this.items.findIndex(item => item.guid === guid);

					if (index > -1) {
						this.items[index].likes = likes;
						this.refreshItems();
					}
				});
				break;
			}
			case `${PostStore}/${PostMutations.incrementVote}`: {
				setTimeout(() => {
					const { post } = mutation.payload;
					const index = this.items.findIndex(item => item.guid === post.guid);

					if (index > -1) {
						this.items[index] = post;
						this.refreshItems();
					}
				});
				break;
			}
			}
		});

		if (this.squad.widget.open) {
			this.updateStreet();
			return;
		}
		this.$root.$once('widget-open', () => this.updateStreet());

		if (this.socket.isAuth && this.me.guest) {
			this.fetchHome();
		}
	},
	destroyed () {
		this.subscription && this.subscription();
	},
	methods: {
		openDialog() {
			if (!this.socket.isAuth && !this.merchant.guest) {
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
		fetchHome() {
			this.showHome = true;
			this.$store.dispatch(`${HomeStore}/${HomeActions.fetch}`, true);
		},
		refreshItems () {
			this.items = this.items.map((item) => {
				item.byMe = item.userId === this.me.userId;
				item.item && (item.item.squadded = false);
				item.item1 && (item.item1.squadded = false);
				item.item2 && (item.item2.squadded = false);
				item.items && item.items.forEach(it => (it.squadded = false));
				return new FeedPost(item);
			});
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
