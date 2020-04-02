<template>
	<div>
		<div class="px-4">
			<v-text-field
				ref="search-text"
				v-model.lazy="searchText"
				class="search-field for-add-friends mt-2"
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
		<div class="mt-4 px-4 friends-list">
			<div v-if="!friends || !friends.length">
				{{ $t('invite_your_friends.search_users') }}
			</div>
			<div v-for="(friend, index) in friends" :key="index">
				<v-divider v-if="index > 0" />
				<div class="d-flex justify-space-between align-center friend-feeds">
					<UserLink
						ref="user-link"
						class="user-link"
						size="35"
						show-screen-name
						:user="friend"
					/>
					<RemoveSquad v-if="isMySquad(friend)" :user="friend" />
					<Button
						v-else-if="!friend.isMySquad"
						class="ma-0 add-user-invite"
						style="background: #ffffff; border: 1px solid #000; color: #000;height: 9.23vw; font-size: 2.15vw; letter-spacing: 1.5px;width: 22.30vw;"
						@click.native="() => invite(friend)"
					>
						<img src="~assets/img/action-add-user.svg" class="my-squad">
						<span class="ml-2">{{ $t('invite') }}</span>
					</Button>
					<Button
						v-else-if="!friend.isInvitee"
						class="ma-0"
						style="background: #fd6256"
						@click.native="() => accept(friend)"
					>
						<v-icon small color="white">
							mdi-check
						</v-icon>
						<span class="ml-1">{{ $t('accept') }}</span>
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
						<span class="ml-1">{{ $t('invited') }}</span>
					</v-btn>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import UserLink from '~/components/UserLink';
import RemoveSquad from '~/components/common/RemoveSquad';
import Button from '~/components/common/Button';
import { ExploreStore, ExploreActions, ExploreMutations } from '~/store/explore';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';

const exploreState = createNamespacedHelpers(ExploreStore).mapState;
const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		Button,
		UserLink,
		RemoveSquad,
	},
	data: () => ({
		searchText: null,
		isTyping: false,
	}),
	computed: {
		...exploreState(['friends']),
		...userState(['me']),
	},
	watch: {
		searchText() {
			this.debounced(() => (this.isTyping = false), 1000);
		},
		isTyping(value) {
			if (value) {
				return;
			}
			this.search();
		},
		me(oldV, newV) {
			if (oldV.squaddersCount !== newV.squaddersCount) {
				this.search();
			}
		},
	},
	destroyed() {
		this.$store.commit(`${ExploreStore}/${ExploreMutations.setFriends}`, []);
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
		async invite(friend) {
			const { me } = this;
			if (!me.nameSelected) {
				return this.$router.push('/select-username');
			}
			await prefetch({
				type: 'inviteSquad',
				targetUserId: friend.userId,
				mutation: `${UserStore}/${UserMutations.setMe}`,
				store: this.$store,
			});
			this.search();
			this.$emit('invited');
		},
		async accept(friend) {
			const { me } = this;
			if (!me.nameSelected) {
				return this.$router.push('/select-username');
			}
			await prefetch({
				type: 'acceptSquad',
				targetUserId: friend.userId,
				mutation: `${UserStore}/${UserMutations.setMe}`,
				store: this.$store,
			});
			this.search();
			this.$emit('invited');
		},
		isMySquad(friend) {
			return friend.isMySquad && !friend.isPending;
		},
		search () {
			this.$store.dispatch(`${ExploreStore}/${ExploreActions.searchFriends}`, this.searchText);
		},
	},
};
</script>

<style lang="scss" scoped>
.search-field {
	padding: 0 10px;
	border: 0px solid #dbdbdb;
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
	height: 200px;
	overflow: auto;
}

.invited-btn {
	font-size: 0.62em !important;
	border-radius: 10px;
}
img.my-squad {
    width: 2.77vw;
}
.add-user-invite {
	width: 20.76vw;
}
.add-user-invite span {
	font-size: 2.15vw;
}
.signin-process {
	.search-field {
		padding: 0 10px;
		border: 1px solid #dbdbdb;
		margin-top: 2.90vw !important;
	}
	.friends-list {
		background: #fff;
		height: 37vh;
	}
}
</style>
