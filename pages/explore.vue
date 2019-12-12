<template>
	<v-container v-if="socket.isAuth" class="layout-padding">
		<TopBar ref="top-bar" class="topBar" />
		<v-layout>
			<Preloader v-if="loading" ref="preloader" class="mt-8" />
			<span v-else-if="!users.length" ref="empty-feed-text">{{ $t('feed.isEmpty') }}</span>
			<UserList :users="users" />
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import UserList from '~/components/UserList';
import Preloader from '~/components/Preloader.vue';
import TopBar from '~/components/common/TopBar.vue';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';

export default {
	name: 'ExplorePage',
	components: {
		Preloader,
		TopBar,
		UserList,
	},
	data: () => ({
		users: [],
		loading: true,
	}),
	computed: {
		...mapState([
			'socket',
			'squad',
		]),
	},
	created () {
		this.onOpen();
	},
	methods: {
		onOpen () {
			if (this.squad.widget.open) {
				this.fetchExplore();
			} else {
				this.$root.$once('widget-open', () => this.fetchExplore());
			}
		},
		async fetchExplore () {
			await prefetch({
				mutation: `${UserStore}/${UserMutations.setUserList}`,
				store: this.$store,
				type: 'fetchExplore',
			});
			this.users = this.$store.state.user.userList;
			this.loading = false;
		},
	},
};
</script>

<style lang="stylus">
.container.layout-padding
	padding 40px 0 0 0
	.layout
		padding 12px
</style>
