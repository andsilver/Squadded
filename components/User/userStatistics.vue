<template>
	<v-list-item align="center" class="px-5 py-2">
		<v-list-item-content v-if="!user.scrolled" class="px-3">
			<v-list-item-title class="font-weight-bold">
				My Squad:
			</v-list-item-title>
		</v-list-item-content>
		<v-list-item-content class="text-left py-0">
			<v-list-item-title class="title">
				{{ short(user.followers.count) }}
			</v-list-item-title>
			<v-list-item-subtitle class="subtitle">
				{{ $t('user.Followers') }}
			</v-list-item-subtitle>
		</v-list-item-content>
		<v-divider class="mx-0" inset vertical />
		<v-list-item-content class="text-left px-5 py-0">
			<v-list-item-title class="title">
				{{ short(user.following) }}
			</v-list-item-title>
			<v-list-item-subtitle class="subtitle">
				{{ $t('user.Following') }}
			</v-list-item-subtitle>
		</v-list-item-content>
	</v-list-item>
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
	methods: {
		short(number) {
			return shortNumber(number, this._i18n.locale);
		},
	},
};
</script>

<style scoped>
	* {
		font-family: 'Montserrat', sans-serif;
	}

	.subtitle {
		color: #B8B8BA !important;
	}
</style>
