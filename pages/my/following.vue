<template>
	<Users :user="user" type="following" />
</template>

<script>
import Users from '~/components/Users';

export default {
	name: 'MyFollowingPage',
	components: {
		Users,
	},
	created () {
		this.user = this.$store.state.user.me;
	},
};
</script>
