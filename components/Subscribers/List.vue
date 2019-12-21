<template>
	<UserList ref="user-list" :users="users" />
</template>

<script>
import UserList from '~/components/UserList';
import { UserStore, UserGetters, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';

export default {
	components: {
		UserList,
	},
	props: {
		type: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		users: [],
	}),
	created () {
		this.fetchFollowers();
	},
	methods: {
		async fetchFollowers () {
			let user = this.$route.params.id
				? this.$store.getters[`${UserStore}/${UserGetters.getUserById}`](this.$route.params.id)
				: this.$store.state.user.me;
			if (!user) {
				user = await prefetch({
					guid: this.$route.params.id,
					mutation: `${UserStore}/${UserMutations.setOther}`,
					store: this.$store,
					type: 'fetchUser',
				}).then(() => this.$store.state.user.other);
			}
			await prefetch({
				guid: user.userId,
				mutation: `${UserStore}/${UserMutations.setUserList}`,
				store: this.$store,
				type: this.type,
			});
			this.users = this.$store.state.user.userList;
		},
	},
};
</script>
