<template>
	<v-container class="layout-padding">
		<TopBar v-if="socket.isAuth" ref="top-bar" class="topBar" />
		<v-layout>
			<Feed ref="feed-layout" :items="items" @click.native="signin" />
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import Feed from '~/components/Feed';
import TopBar from '~/components/common/TopBar.vue';
import { FeedPost } from '~/classes/FeedPost';
import { SquadAPI } from '~/services/SquadAPI';
import { SquadStore, SquadMutations } from '~/store/squad';

export default {
	components: {
		Feed,
		TopBar,
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
		const _self = this;
		if (this.squad.widget.open) {
			this.updateStreet();
		}
		this.unsubscribe = this.$store.subscribe((mutation) => {
			if (mutation.type === `${SquadStore}/${SquadMutations.setWidgetState}` && mutation.payload === true) {
				_self.updateStreet();
			}
		});
	},
	destroyed() {
		this.unsubscribe && this.unsubscribe();
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
