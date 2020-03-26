<template>
	<section v-if="!scrolled" class="user_statistics">
		<!-- <h4 class="px-3 my_squad_title">
			{{ $t('My Squad') }}
		</h4> -->
		<section class="statistic">
			<nuxt-link v-if="user.isMe" :to="{ path: `${userPath}/mysquad` }">
				<v-list-item-title class="title">
					{{ short(user.squaddersCount) }}
				</v-list-item-title>
				<v-list-item-subtitle class="subtitle">
					{{ $t('user.InSquad') }}
				</v-list-item-subtitle>
			</nuxt-link>
			<div v-else-if="isMySquad">
				<v-list-item-title class="title" style="color: #b8b8ba">
					{{ short(user.squaddersCount) }}
				</v-list-item-title>
				<v-list-item-subtitle class="subtitle">
					{{ $t('user.InSquad') }}
				</v-list-item-subtitle>
			</div>
			<div v-else-if="isInvitee || (!squadPossible && invited)">
				<v-list-item-title class="title">
					<v-icon color="#fd6256">
						mdi-account-check-outline
					</v-icon>
				</v-list-item-title>
				<v-list-item-subtitle class="subtitle" style="color: #fd6256">
					{{ $t('user.invitation.accept') }}
				</v-list-item-subtitle>
			</div>
			<div v-else-if="isPending || invited">
				<v-list-item-title class="title">
					<v-icon color="#B8B8BA">
						mdi-account-check-outline
					</v-icon>
				</v-list-item-title>
				<v-list-item-subtitle class="subtitle">
					{{ $t('user.invitation.pending') }}
				</v-list-item-subtitle>
			</div>
			<div v-else style="cursor: pointer" @click="invite">
				<v-list-item-title class="title">
					<v-icon color="black">
						mdi-account-plus-outline
					</v-icon>
				</v-list-item-title>
				<v-list-item-subtitle class="subtitle">
					{{ $t('user.invitation.invite') }}
				</v-list-item-subtitle>
			</div>
			<v-divider class="divider" inset vertical />
			<nuxt-link :to="{ path: `${userPath}/followers` }">
				<v-list-item-title class="title">
					{{ short(user.followers.count) }}
				</v-list-item-title>
				<v-list-item-subtitle class="subtitle">
					{{ $t('user.Followers') }}
				</v-list-item-subtitle>
			</nuxt-link>
			<v-divider class="divider" inset vertical />
			<nuxt-link :to="{ path: `${userPath}/following` }">
				<v-list-item-title class="title">
					{{ short(user.following.count) }}
				</v-list-item-title>
				<v-list-item-subtitle class="subtitle">
					{{ $t('user.Following') }}
				</v-list-item-subtitle>
			</nuxt-link>
		</section>
	</section>
	<!-- <section v-else class="fixed_statistic">
		<nuxt-link :to="{ path: `${userPath}/followers` }" class="fixed_link">
			<span>{{ short(user.followers.count) }}</span><span class="statistic_title_fixed">{{ $t('user.Followers') }}</span>
		</nuxt-link>
		<v-divider class="divider" inset vertical />
		<nuxt-link :to="{ path: `${userPath}/following` }" class="fixed_link">
			<span>{{ short(user.following.count) }}</span><span class="statistic_title_fixed">{{ $t('user.Following') }}</span>
		</nuxt-link>
	</section> -->
</template>

<script>
import { shortNumber } from '~/helpers';
export default {
	props: {
		user: {
			type: Object,
			required: true,
		},
		scrolled: {
			type: Boolean,
			default: false,
		},
		invited: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		userPath () {
			return this.user.isMe ? '/my' : `/user/${this.user.userId}`;
		},
		inviteInPending() {
			return !this.user.isMe &&
				this.user.squad &&
				this.user.squad.exists &&
				this.user.squad.pending &&
				!this.user.squad.invitee;
		},
		squadPossible() {
			if (this.user.isMe) {
				return false;
			}
			const squad = this.user.squad;
			return squad && squad.exists;
		},
		isMySquad () {
			return this.squadPossible && !this.user.squad.pending;
		},
		isPending() {
			return this.squadPossible && this.user.squad.pending;
		},
		isInvitee() {
			return this.isPending && this.user.squad.invitee;
		},
	},
	methods: {
		short(number) {
			return shortNumber(number, this._i18n.locale);
		},
		invite() {
			this.$emit('invite');
		},
	},
};
</script>

<style scoped>
	.title {
		font-weight: 700;
		font-size: 4.92VW !important;
	}

	.subtitle {
		color: #B8B8BA;
		font-weight: 500;
	}

	.my_squad_title {
		width: 100%;
		padding: 0;
		margin-bottom: 2%;
		text-align: center;
		color: #B8B8BA;
		font-weight: 600;
	}

	.statistic {
		display: flex;
		justify-content: space-around;
		padding: 0 7.6vw;
		text-align: center;
	}

	.user_statistics {
		width: 100%;
		margin-bottom: 2vw;
	}

	.divider {
		height: 40px;
	}

	.fixed_statistic {
		display: flex;
		flex-direction: row;
	}

	.fixed_link {
		color: black;
		font-size: .7em;
		width: auto;
	}

	.fixed_statistic .divider {
		font-size: .7em;
		line-height: 1em;
		height: 12px;
		margin-left: 6%;
		margin-right: 4%;
		margin-top: 1%;
	}

	.statistic_title_fixed {
		color: #B8B8BA;
		margin-left: 8%;
		font-weight: 500;
	}

	.disabled {
		pointer-events: none;
	}
</style>
