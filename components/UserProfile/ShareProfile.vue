<template>
	<v-card>
		<v-card-title class="share_title">
			{{ $t('user.share') }}
			<v-btn icon class="close-dialog" @click.native="hide">
				<v-icon size="3.69vw">
					sqdi-close-cross
				</v-icon>
			</v-btn>
		</v-card-title>
		<v-card-text class="share_url">
			<v-text-field ref="user-link" :value="userLink" />
		</v-card-text>
		<v-btn
			class="full-width copy_btn"
			color="primary"
			large
			depressed
			@click="copyUserLink"
		>
			Copy Link
		</v-btn>
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
		hide () {
			this.$emit('hideShowShare');
		},
	},
};
</script>

<style lang="stylus" scoped>

.share_box
	.v-card
		border-radius 0
		box-shadow none
		background transparent
	.share_title
		font-size 4.30vw
		font-weight 700
		color #000000
		padding 0
		display flex
		justify-content space-between
	.share_url
		padding 0
		.v-input
			background transparent
	.copy_btn
		width 46.92vw
		margin 0 auto
		padding 4.76vw
		height auto
		font-size 2.91vw
		font-weight 700
		display block
		border-radius 3.07vw
</style>
