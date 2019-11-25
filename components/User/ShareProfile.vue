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

export default {
	props: {
		userLink: {
			type: String,
			required: true,
		},
	},
	methods: {
		copyUserLink () {
			this.$refs['user-link'].$el.querySelector('input').select();
			copy();
		},
	},
};
</script>

<style lang="stylus" scoped>

</style>
