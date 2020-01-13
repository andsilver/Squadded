<template>
	<v-card>
		<v-card-title>
			{{ $t('post.share') }}
		</v-card-title>
		<v-card-text>
			<v-text-field ref="post-link" :value="postLink">
				<v-icon ref="copy-icon" slot="append" @click="copyPostLink">
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
		postLink: {
			type: String,
			required: true,
		},
	},
	methods: {
		copyPostLink () {
			this.$refs['post-link'].$el.querySelector('input').select();
			copy();
		},
	},
};
</script>

<style lang="stylus" scoped>

</style>
