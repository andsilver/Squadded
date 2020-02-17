<template>
	<v-dialog v-model="show" content-class="violation">
		<v-card>
			<v-card-title>
				<v-row align="center" justify="space-between">
					<span class="pa-4" />
					<h6 ref="title" class="violation-title">
						{{ $t('moderation.violation') }}
					</h6>
					<v-btn ref="close-btn" icon @click="close">
						<v-icon x-small>
							sqdi-close-cross
						</v-icon>
					</v-btn>
				</v-row>
			</v-card-title>
			<v-card-text class="px-4 mt-1 text-center">
				<div ref="description" style="color: black">
					{{ $t('moderation.text') }}
				</div>
			</v-card-text>
			<v-card-actions class="pb-4">
				<Button ref="ok-btn" class="violation-action" @click.native="close">
					{{ $t('ok') }}
				</Button>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
	},
	data: () => ({
		show: true,
	}),
	methods: {
		close() {
			this.$emit('close');
		},
	},
};
</script>

<style lang="stylus">
	.violation
		margin 1px
		border-radius 30px
		&-title
			font-size 14px
			font-weight bold
			color black
		&-action
			height: 42px !important;
			padding: 0 32px !important;
			font-weight: 900 !important;
</style>
