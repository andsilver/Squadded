<template>
	<div>
		<v-text-field
			ref="search-plus"
			v-model="searchText"
			class="search-plus"
			:hide-details="true"
			:placeholder="$t('mysquad.search')"
			clearable
		>
			<v-icon slot="prepend" color="#B8B8BA" size="22">
				sqdi-magnifying-glass-finder
			</v-icon>
		</v-text-field>
		<template v-if="squadders && squadders.length">
			<div v-for="(squadder, index) in filtered" :key="index">
				<div class="d-flex justify-space-between align-center">
					<UserLink
						ref="user-link"
						class="user-link"
						size="35"
						:user="squadder"
					/>
					<RemoveSquad ref="remove-squad" :user="squadder" @remove="() => removeSquadAction(index)" />
				</div>
				<v-divider />
			</div>
		</template>
		<div v-else>
			{{ $t('user.empty_squad') }}
		</div>
		<div ref="send-invite" class="send-invite">
			<v-btn
				ref="remove-trigger"
				depressed
				style="font-size: 12px; font-weight: 600"
				@click="showAddFriends = true"
			>
				{{ $t('mysquad.add_friends') }}
			</v-btn>
		</div>
		<AddFriendsDialog ref="add-friends-dialog" :show="showAddFriends" @close="showAddFriends = false" />
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import UserLink from '~/components/UserLink';
import { FeedStore } from '~/store/feed';
import { prefetch } from '~/helpers';
import RemoveSquad from '~/components/common/RemoveSquad';
import AddFriendsDialog from '~/components/common/AddFriendsDialog';

const feedStore = createNamespacedHelpers(FeedStore).mapState;

export default {
	components: {
		UserLink,
		RemoveSquad,
		AddFriendsDialog,
	},
	data: () => ({
		searchText: '',
		showAddFriends: false,
	}),
	computed: {
		filtered() {
			if (!this.searchText) {
				return this.squadders;
			}
			return this.squadders && this.squadders.filter(u => u.screenName.toLowerCase().includes(this.searchText.toLowerCase()));
		},
		...feedStore(['squadders']),
	},
	created () {
		this.fetchSquadders();
	},
	methods: {
		fetchSquadders () {
			prefetch({
				type: 'fetchSquadders',
				store: this.$store,
			});
		},
		removeSquadAction (index) {
			this.squadders.splice(index, 1);
		},
		showModal () {
			this.showShare = true;
			this.$forceUpdate();
		},
		hideShare () {
			this.showShare = false;
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

.send-invite {
	position: fixed;
	bottom: 67px;
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 16px 0;
	background: white;
	padding-right: 24px;
	border-top: 1px solid #ececec;
}
</style>
