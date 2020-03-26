<template>
	<span>
		<v-btn ref="remove-trigger" depressed class="px-2 remove-squad-btn" @click="removeSquad">
			<v-icon small>
				mdi-account-outline
			</v-icon>
			<span class="in-squad-text">{{ $t('user.InSquad') }}</span>
		</v-btn>
		<v-dialog v-model="showSquadderRemoveDialog">
			<v-card v-if="user" ref="removing-squadder">
				<v-card-title>
					<v-row align="center" justify="space-between">
						<v-avatar ref="squadder-avatar" :size="36">
							<v-img :src="user.avatar" />
						</v-avatar>
						<h5 ref="title" style="color: black">
							{{ $t('user.remove_squad.title', { user: user.screenName }) }}
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
						{{ $t('user.remove_squad.description', { user: user.screenName }) }}
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
	</span>
</template>

<script>
import { HomeStore, HomeMutations, HomeActions } from '~/store/home';
import { FeedStore, FeedMutations, FeedActions } from '~/store/feed';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';

export default {
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		showSquadderRemoveDialog: false,
	}),
	methods: {
		removeSquad() {
			this.showSquadderRemoveDialog = true;
		},
		async removeSquadAction () {
			this.showSquadderRemoveDialog = false;
			this.$ws.sendObj({
				type: 'removeSquadder',
				guid: this.user.userId || this.user.guid,
			});
			this.$emit('remove');
			await prefetch({
				mutation: `${UserStore}/${UserMutations.setMe}`,
				store: this.$store,
				type: 'removeSquadder',
				guid: this.user.userId || this.user.guid,
			});
			this.$store.commit(`${HomeStore}/${HomeMutations.clear}`);
			this.$store.dispatch(`${HomeStore}/${HomeActions.fetch}`);
			this.$store.commit(`${FeedStore}/${FeedMutations.clear}`);
			this.$store.dispatch(`${FeedStore}/${FeedActions.fetch}`);
			prefetch({ type: 'fetchSquadders', store: this.$store });
		},
	},
};
</script>

<style lang="scss" scoped>
.in-squad-text {
	font-size: 10px;
	margin-left: 4px;
	font-weight: 700;
}

.remove-squad-btn {
	border-radius: 10px !important;
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
</style>
