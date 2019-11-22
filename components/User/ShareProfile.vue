<template>
	<v-card>
		<v-card-title>
			{{ $t('user.share') }}
		</v-card-title>
		<v-card-text>
			<v-text-field ref="user-link" :value="userLink">
				<v-icon slot="append" @click="copyUserLink">
					mdi-content-copy
				</v-icon>
			</v-text-field>
		</v-card-text>
	</v-card>
</template>

<script>
import { copy } from '~/utils/copy';
const { API_ENDPOINT } = process.env;

export default {
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
	computed: {
		userLink () {
			const target = JSON.stringify({
				id: this.user.userId,
				url: this.$store.state.merchant.siteUrl,
				title: this.$store.state.merchant.siteTitle,
			});
			return `${API_ENDPOINT}/community/profile?t=${btoa(target)}`;
		},
	},
	methods: {
		copyUserLink () {
			if (navigator && navigator.share) {
				navigator.share({
					title: this.$store.state.merchant.siteTitle,
					text: this.$store.state.merchant.siteTitle,
					url: this.userLink,
				});
			} else {
				this.$refs['user-link'].$el.querySelector('input').select();
				copy();
			}
		},
	},
};
</script>

<style lang="stylus" scoped>

</style>
