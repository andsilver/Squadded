<template>
	<section class="user_statistics">
		<h4 class="px-3 my_squad_title">
			{{ $t('My Squad') }}
		</h4>
		<section class="statistic">
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
</template>

<script>
import { shortNumber } from '~/helpers';
export default {
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
	computed: {
		userPath () {
			return this.user.isMe ? '/my' : `/user/${this.user.userId}`;
		},
	},
	methods: {
		short(number) {
			return shortNumber(number, this._i18n.locale);
		},
	},
};
</script>

<style scoped>
	.title {
		font-weight: 500;
	}

	.subtitle {
		color: #B8B8BA !important;
		font-weight: 500;
	}

	.my_squad_title {
		width: 100%;
		padding: 0;
		margin-bottom: 2%;
		text-align: center;
		color: #B8B8BA !important;
		font-weight: 600;
	}

	.statistic {
		display: flex;
		justify-content: space-around;
		padding: 0 20%;
		text-align: center;
	}

	.user_statistics {
		width: 100%;
	}

	.divider {
		height: 40px !important;
	}
</style>
