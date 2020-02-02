<template>
	<v-dialog v-model="show" content-class="start-watching">
		<v-card ref="start-watching">
			<v-card-title>
				<v-row align="center" justify="space-between">
					<span />
					<h6 ref="title" class="start-watching-title">
						{{ $t('community.start_watching.title') }}
					</h6>
					<v-btn ref="close-btn" icon @click="show = false">
						<v-icon x-small>
							sqdi-close-cross
						</v-icon>
					</v-btn>
				</v-row>
			</v-card-title>
			<v-card-text class="px-4 mt-1 text-center">
				<div ref="description" style="color: black">
					{{ $t('community.start_watching.description') }}
				</div>
			</v-card-text>
			<v-card-actions class="pb-4">
				<Button ref="start-watching-btn" class="start-watching-action" @click.native="show = false">
					{{ $t('community.start_watching.action') }}
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
};
</script>

<style lang="stylus">
	.start-watching
		margin 1px
		border-radius 30px
		&-title
			font-size 14px
			font-weight bold
			color black
		&-action
			height: 42px !important;
			padding: 0 20px !important;
			font-weight: 900 !important;
</style>
