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
					<RemoveSquad ref="remove-squad" :user="squadder" @remove="() => removeSquadAction(index)" />
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
		<v-dialog v-model="showShare" content-class="share_box">
			<ShareProfile ref="share-profile-modal" :user-link="userLink" @hideShowShare="hideShare" />
		</v-dialog>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import UserLink from '~/components/UserLink';
import Button from '~/components/common/Button';
import { FeedStore, FeedMutations } from '~/store/feed';
import { prefetch } from '~/helpers';
import ShareProfile from '~/components/UserProfile/ShareProfile';
import RemoveSquad from '~/components/common/RemoveSquad';
import { UserStore } from '~/store/user';

const CANCALED_BY_USER = 20;
const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	components: {
		UserLink,
		Button,
		ShareProfile,
		RemoveSquad,
	},
	data: () => ({
		squadders: [],
		searchText: '',
		showShare: false,
	}),
	computed: {
		...userState([
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
		removeSquadAction (index) {
			this.squadders.splice(index, 1);
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
