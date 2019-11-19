<template>
	<v-container>
		<v-layout>
			<Feed ref="feed-layout" :items="items" @click.native="signin" />
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import Feed from '~/components/Feed';
import { FeedPost } from '~/classes/FeedPost';
import { SquadAPI } from '~/services/SquadAPI';

export default {
	components: {
		Feed,
	},
	data: () => ({
		items: null,
		unsubscribe: null,
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
		}
		this.$root.$on('widget-open', () => this.updateStreet());
	},
	methods: {
		async updateStreet () {
			this.items = null;
			const publicFeed = await SquadAPI.fetchStreet(this.merchant.id);
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
