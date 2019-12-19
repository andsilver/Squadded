<template>
	<v-container>
		<BackBar :title="$tc(`user.${type}`, user.name)" />
		<UserList ref="user-list" :users="users" />
	</v-container>
</template>

<script>
import BackBar from '~/components/common/BackBar';
import UserList from '~/components/UserList';
import { UserStore, UserGetters, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';

const MSG_TYPES = {
	followers: 'fetchFollowers',
	following: 'fetchFollowing',
};

export default {
	name: 'Users',
	components: {
		BackBar,
		UserList,
	},
	async asyncData ({ store, params, route }) {
		const type = route.name.split('-').slice(-1)[0];
		let user = params.id
			? store.getters[`${UserStore}/${UserGetters.getUserById}`](params.id)
			: store.state.user.me;
		if (!user) {
			user = await prefetch({
				guid: params.id,
				mutation: `${UserStore}/${UserMutations.setOther}`,
				store,
				type: 'fetchUser',
			}).then(() => store.state.user.other);
		}
		return prefetch({
			guid: user.userId,
			mutation: `${UserStore}/${UserMutations.setUserList}`,
			store,
			type: MSG_TYPES[type],
		}).then(() => ({
			type,
			user,
			users: store.state.user.userList,
		}));
	},
	data: () => ({
		type: null,
		users: null,
		user: null,
	}),
};
</script>
