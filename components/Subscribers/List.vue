<template>
	<div>
		<v-text-field
			ref="search-plus"
			v-model="searchText"
			class="search-plus"
			:hide-details="true"
			:placeholder="$t('Search')"
			clearable
		>
			<v-icon slot="prepend" color="#B8B8BA" size="22">
				sqdi-magnifying-glass-finder
			</v-icon>
		</v-text-field>
		<UserList ref="user-list" :users="filtered" />
	</div>
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
		searchText: '',
	}),
	computed: {
		filtered() {
			if (!this.searchText) {
				return this.users;
			}
			return this.users && this.users.filter(u => u.name.toLowerCase().includes(this.searchText.toLowerCase()));
		},
	},
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
<style lang="scss" scoped>
.search-plus {
	&.v-text-field {
		padding-top: 8px;
		padding-bottom: 8px;
		margin-top: 0;
		font-size: 3.230vw;
		font-weight: 500;
		width: 100%;
	}
	.v-input__prepend-outer {
		margin-right: 0.615vw;
	}
	&.v-input__append-outer, &.v-input__prepend-outer{
		margin-bottom: 0px;
		margin-top: 0px;
	}
	&.theme--light.v-input:not(.v-input--is-disabled) input {
		color: #B8B8BA;
	}
	&.v-text-field input {
		padding: 0px 2.153vw 0px!important;
		font-size: 3.80vw;
	}
	i.v-icon.sqdi-magnifying-glass-finder {
		font-size: 4.69vw !important;
		color: black !important;
	}
	.v-input__icon.v-input__icon--clear {
		background: black !important;
	}
	.v-input__control .v-input__append-inner .v-input__icon--clear{
		background: black !important;

		.v-icon{
			color: white;
			font-size: 16px;
		}
	}
}
</style>
