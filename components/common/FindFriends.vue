<template>
	<div>
		<div class="px-4">
			<v-text-field
				ref="search-text"
				v-model.lazy="searchText"
				class="search-field mt-2"
				solo
				flat
				dense
				hide-details
				:placeholder="$t('explore_page.search.find_friends')"
				@input="isTyping = true"
			>
				<v-icon slot="prepend" class="mt-1 mr-0" color="#B8B8BA" small>
					sqdi-magnifying-glass-finder
				</v-icon>
			</v-text-field>
		</div>
		<div v-if="friends && friends.length" class="mt-4 px-4 friends-list">
			<div v-for="(friend, index) in friends" :key="index">
				<v-divider v-if="index > 0" />
				<div class="d-flex justify-space-between align-center">
					<UserLink
						ref="user-link"
						class="user-link"
						size="35"
						show-screen-name
						:user="friend"
					/>
					<Button v-if="!friend.invited" @click.native="() => invite(friend)">
						<v-icon small color="white">
							mdi-account-plus-outline
						</v-icon>
						<span class="ml-2">{{ $t('invite') }}</span>
					</Button>
					<v-btn
						v-else
						class="invited-btn"
						outlined
						disabled
					>
						<v-icon small color="#b8b8b0">
							mdi-account-check-outline
						</v-icon>
						<span class="ml-2">{{ $t('invited') }}</span>
					</v-btn>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import UserLink from '~/components/UserLink';
import Button from '~/components/common/Button';
import { ExploreStore, ExploreActions, ExploreMutations } from '~/store/explore';

const exploreState = createNamespacedHelpers(ExploreStore).mapState;

export default {
	components: {
		Button,
		UserLink,
	},
	data: () => ({
		searchText: null,
		isTyping: false,
	}),
	computed: {
		...exploreState(['friends']),
	},
	watch: {
		searchText() {
			this.debounced(() => (this.isTyping = false), 1000);
		},
		isTyping(value) {
			if (value) {
				return;
			}
			this.$store.dispatch(`${ExploreStore}/${ExploreActions.searchFriends}`, this.searchText);
		},
	},
	methods: {
		debounced(fn, delay) {
			let timerId;
			if (timerId) {
				clearTimeout(timerId);
			}
			timerId = setTimeout(() => {
				fn();
				timerId = null;
			}, delay);
		},
		invite(friend) {
			const { me } = this.$store.state.user;
			if (!me.nameSelected) {
				return this.$router.push('/select-username');
			}
			this.$ws.sendObj({
				type: 'acceptSquad',
				targetUserId: friend.userId || friend.guid,
			});
			this.$store.commit(`${ExploreStore}/${ExploreMutations.setInvited}`, friend.userId);
			this.$forceUpdate();
			this.$emit('invited');
		},
	},
};
</script>

<style lang="scss" scoped>
.search-field {
	padding: 0 10px;
	border: 1px solid #dbdbdb;
	border-radius: 10px;

	>>> .v-input__slot {
		min-height: 30px !important;
	}

	input {
		font-weight: 600;
		font-size: 12px;
	}
}

.v-btn {
	margin: 0;
}

.friends-list {
	background: #f9f9f9;
	max-height: 250px;
	overflow: auto;
}

.invited-btn {
	font-size: 0.62em !important;
	border-radius: 10px;
}
</style>
<style lang="scss">
.user-link .v-list-item {
	background-color: #f9f9f9 !important;
}
</style>
