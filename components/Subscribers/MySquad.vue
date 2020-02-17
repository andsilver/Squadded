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
		<template v-if="squadders && squadders.length">
			<div v-for="(squadder, index) in filtered" :key="index">
				<div class="d-flex justify-space-between align-center">
					<UserLink
						ref="user-link"
						class="user-link"
						size="35"
						:user="squadder"
					/>
					<v-btn depressed class="px-2" @click="() => removeSquad(squadder)">
						<v-icon>
							mdi-account-outline
						</v-icon>
						<span class="in-squad-text">{{ $t('user.InSquad') }}</span>
					</v-btn>
				</div>
				<v-divider />
			</div>
		</template>
		<div v-else>
			{{ $t('user.empty_squad') }}
		</div>
		<div ref="send-invite" class="send-invite">
			<Button @click.native="share">
				{{ $t('user.invitation.send_invite_link') }}
			</Button>
		</div>
		<v-dialog v-model="showShare">
			<ShareProfile ref="share-profile-modal" :user-link="userLink" />
		</v-dialog>
		<v-dialog v-model="showSquadderRemoveDialog">
			<v-card v-if="removingSquadder" ref="removing-squadder">
				<v-card-title>
					<v-row align="center" justify="space-between">
						<v-avatar ref="squadder-avatar" :size="36">
							<v-img :src="removingSquadder.avatar" />
						</v-avatar>
						<h5 ref="title" style="color: black">
							{{ $t('user.remove_squad.title', { user: removingSquadder.screenName }) }}
						</h5>
						<v-btn ref="close-btn" icon @click="showSquadderRemoveDialog = false">
							<v-icon x-small>
								sqdi-close-cross
							</v-icon>
						</v-btn>
					</v-row>
				</v-card-title>
				<v-card-text class="px-4 mt-3 text-center">
					<h4 ref="description" style="color: black">
						{{ $t('user.remove_squad.description', { user: removingSquadder.screenName }) }}
					</h4>
				</v-card-text>
				<v-card-actions class="px-4">
					<v-btn ref="remove-btn" outlined depressed class="remove-btn flex-grow-1" @click="removeSquadAction">
						<v-icon x-small color="white">
							sqdi-close-cross
						</v-icon>
						<span class="ml-2">{{ $t('user.remove_squad.remove') }}</span>
					</v-btn>
					<v-btn ref="cancel-btn" outlined depressed class="cancel-btn flex-grow-1" @click="showSquadderRemoveDialog = false">
						{{ $t('user.remove_squad.cancel') }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { UserStore, UserActions } from '~/store/user';
import UserLink from '~/components/UserLink';
import Button from '~/components/common/Button';
import { FeedStore, FeedMutations } from '~/store/feed';
import { prefetch } from '~/helpers';
import ShareProfile from '~/components/UserProfile/ShareProfile';

const CANCALED_BY_USER = 20;
const { mapState } = createNamespacedHelpers(UserStore);

export default {
	components: {
		UserLink,
		Button,
		ShareProfile,
	},
	data: () => ({
		squadders: [],
		searchText: '',
		showSquadderRemoveDialog: false,
		removingSquadder: null,
		showShare: false,
	}),
	computed: {
		...mapState([
			'me',
		]),
		filtered() {
			if (!this.searchText) {
				return this.squadders;
			}
			return this.squadders && this.squadders.filter(u => u.screenName.toLowerCase().includes(this.searchText.toLowerCase()));
		},
		target () {
			const { siteUrl, siteTitle } = this.$store.state.merchant;
			return {
				id: this.me.userId,
				url: siteUrl,
				title: siteTitle,
				invite: true,
			};
		},
		userLink () {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			return `${API_ENDPOINT}/community/profile?t=${btoa(target)}`;
		},
	},
	created () {
		this.fetchSquadders();
	},
	methods: {
		async fetchSquadders () {
			this.squadders = await prefetch({
				type: 'fetchSquadders',
				store: this.$store,
				mutation: `${FeedStore}/${FeedMutations.receiveSquadders}`,
			});
		},
		removeSquad(squadder) {
			this.showSquadderRemoveDialog = true;
			this.removingSquadder = squadder;
		},
		removeSquadAction () {
			this.showSquadderRemoveDialog = false;
			this.$ws.sendObj({
				type: 'removeSquadder',
				guid: this.removingSquadder.userId,
			});
			const index = this.squadders.indexOf(this.removingSquadder);
			this.squadders.splice(index, 1);
			const { me } = this;
			me.squaddersCount -= 1;
			this.$store.dispatch(`${UserStore}/${UserActions.setProfile}`, me);
		},
		async share () {
			this.showShare = false;
			if (navigator && navigator.share) {
				const { siteTitle } = this.$store.state.merchant;
				const title = `${this.me.name} @ ${siteTitle}`;
				try {
					await navigator.share({
						title,
						text: title,
						url: this.userLink,
					});
				} catch (error) {
					if (error.code !== CANCALED_BY_USER) {
						this.showModal();
					}
				}
			} else {
				this.showModal();
			}
		},
		showModal () {
			this.showShare = true;
			this.$forceUpdate();
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

.in-squad-text {
	font-size: 10px;
	margin-left: 4px;
	font-weight: 700;
}

.remove-btn, .cancel-btn {
	font-size: 0.6em;
	font-weight: 700;
	letter-spacing: 1px;
	border-radius: 10px;
}

.remove-btn {
	background-color: #fd6256 !important;
	color: white;
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
