<template>
	<v-dialog v-model="show">
		<v-card>
			<v-card-title ref="title">
				{{ $t('profile_settings.saving_confirm.title') }}
			</v-card-title>
			<v-card-text ref="text" class="text">
				{{ $t('profile_settings.saving_confirm.description') }}
			</v-card-text>
			<v-card-actions class="d-flex justify-center">
				<v-btn ref="leave-btn" outlined depressed class="leave-btn flex-grow-1" @click="leave">
					{{ $t('profile_settings.leave') }}
				</v-btn>
				<Button ref="save-btn" class="ma-0 ml-2 flex-grow-1" @click.native="save">
					{{ $t('Save') }}
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
	props: {
		next: {
			type: Function,
			default: () => {},
		},
	},
	data: () => ({
		show: true,
	}),
	methods: {
		leave () {
			this.$emit('leave');
		},
		save () {
			this.$emit('save');
		},
	},
};
</script>

<style lang="stylus" scoped>
.leave-btn
	font-size 0.6em
	font-weight 700
	letter-spacing 1px
	border-radius 10px
.text
	color black !important
	font-weight 600
	padding 12px
</style>
