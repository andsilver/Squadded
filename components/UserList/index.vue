<template>
	<v-list v-if="users && users.length" class="user-list">
		<v-list-item v-for="user in users" :key="user.userId">
			<UserLink
				ref="user-link"
				class="user-link"
				size="35"
				:user="user"
			/>
			<!-- Remove watch and watching button @Yash will manage-->
			<!-- <Follow v-if="notMe(user) && showFollow" ref="follow-btn" :user="user" class="follow" /> -->
		</v-list-item>
	</v-list>
</template>

<script>
// import Follow from '~/components/common/Follow';
import UserLink from '~/components/UserLink';

export default {
	components: {
		// Follow,
		UserLink,
	},
	props: {
		users: {
			type: Array,
			default: () => [],
		},
		showFollow: {
			type: Boolean,
			default: true,
		},
	},
	methods: {
		notMe (user) {
			return user.userId !== this.$store.state.user.me.userId;
		},
	},
};
</script>

<style lang="stylus" scoped>
.user-list
	width 100%
	> .v-list-item
		padding 10px 0
		border-bottom 1px solid #DBDBDB
	>>> .v-avatar
		margin 0

.user-link
	flex-grow 1
</style>
