<template>
	<v-container>
		<v-layout>
			<Feed
				ref="street-layout"
				:items="items"
				@mousedown.native="signin"
				@touchstart.native="signin"
			/>
			<StartWatchingDialog v-if="showStartWatchingDialog" ref="start-watching-dialog" />
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import Feed from '~/components/Feed';
import { FeedPost } from '~/classes/FeedPost';
import { SquadAPI } from '~/services/SquadAPI';
import StartWatchingDialog from '~/components/Community/StartWatchingDialog';

export default {
	components: {
		Feed,
		StartWatchingDialog,
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
		if (sessionStorage.getItem('visited')) {
			this.showStartWatchingDialog = false;
		} else {
			this.showStartWatchingDialog = true;
			sessionStorage.setItem('visited', `${Date.now()}`);
		}
		if (this.squad.widget.open) {
			this.updateStreet();
			return;
		}
		this.$root.$once('widget-open', () => this.updateStreet());
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
};
</script>
