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
			<div class="my-squade-container">
				<div class="my-squade-scroll">
					<div v-for="(squadder, index) in filtered" :key="index">
						<div class="d-flex justify-space-between align-center">
							<UserLink
								ref="user-link"
								class="user-link my-squad"
								size="10.76vw"
								is-squadlist
								:user="squadder"
							/>
							<RemoveSquad ref="remove-squad" class="my-squad" :user="squadder" @remove="() => removeSquadAction(index)" />
						</div>
						<v-divider />
					</div>
				</div>
			</div>
		</template>
		<div v-else>
			{{ $t('user.empty_squad') }}
		</div>
		<div ref="send-invite" class="send-invite">
			<v-btn
				ref="remove-trigger"
				depressed
				style="font-size: 2.615vw;font-weight: 700;height: 12.307vw;width: 36.92vw;border-radius: 2.30vw;background: #000;color: #fff;letter-spacing: 2px;"
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
    bottom: 0;
    width: 100%;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    background: white;
    z-index: 200;
    left: 0;
    height: 23.07vw;
    align-items: center;
}
.my-squade-scroll {
	height: calc(100vh - 197px);
	overflow-y: auto;
}
.my-squade-container{
	position: relative;
	padding: 0px 14px 0px;
	margin-left: -12px;
	margin-right: -12px;
	margin-top: 0px !important;
}
.my-squade-container::before{
	background: -moz-linear-gradient(top,  rgba(218,217,221,0.3) 0%, rgba(255,255,255,0) 100%);
	background: -webkit-linear-gradient(top,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%);
	background: linear-gradient(to bottom,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#dad9dd', endColorstr='#00ffffff',GradientType=0 );
	height:4.615vw;
	width:100%;
	content: '';
	left: 0;
	position: absolute;
	top: 0px;
}
.my-squade-container::after{
	background: -moz-linear-gradient(top,  rgba(255,255,255,0) 0%, rgba(218,217,221,0.3) 100%);
	background: -webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%);
	background: linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(218,217,221,0.3) 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#dad9dd',GradientType=0 );
	height:4.615vw;
	width:100%;
	content: '';
	left: 0;
	position: absolute;
	bottom: 0px;
}
</style>
