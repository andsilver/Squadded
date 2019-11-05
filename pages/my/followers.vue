<template>
	<Users :user="user" type="followers" />
</template>

<script>
import Users from '~/components/Users';

export default {
	name: 'MyFollowersPage',
	components: {
		Users,
	},
	created () {
		this.user = this.$store.state.user.me;
	},
};
</script>
