<template>
	<v-container>
		<BackBar :title="$tc(`user.${type}`, user.name)" />
		<UserLink
			v-for="usr in users"
			:key="usr.userId"
			:user="usr"
		/>
	</v-container>
</template>

<script>
import UserLink from '~/components/UserLink';
import BackBar from '~/components/common/BackBar';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';

const MSG_TYPES = {
	followers: 'fetchFollowers',
	following: 'fetchFollowing',
};

export default {
	name: 'Users',
	components: {
		UserLink,
		BackBar,
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		users: null,
	}),
	created () {
		prefetch({
			guid: this.user.userId,
			mutation: `${UserStore}/${UserMutations.setUserList}`,
			store: this.$store,
			type: MSG_TYPES[this.type],
		}).then(() => {
			this.users = this.$store.state.user.userList;
		});
	},
};
</script>
