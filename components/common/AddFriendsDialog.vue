<template>
	<v-dialog v-model="showDialog" content-class="add-friends-dialog">
		<div ref="title" class="subtitle-1 font-weight-bold text-center mt-4 mb-5">
			{{ $t('mysquad.add_friends') }}
			<v-btn icon class="close-dialog" @click.native="hide">
				<v-icon size="3.69vw">
					sqdi-close-cross
				</v-icon>
			</v-btn>
		</div>
		<div class="mb-0">
			<FindFriends v-if="showDialog" ref="find-friends" />
		</div>
		<ShareInviteLink class="pt-3 pb-4 px-3" />
	</v-dialog>
</template>

<script>
import FindFriends from '~/components/common/FindFriends';
import ShareInviteLink from '~/components/common/ShareInviteLink';

export default {
	components: {
		FindFriends,
		ShareInviteLink,
	},
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		showDialog: false,
	}),
	watch: {
		show() {
			this.showDialog = this.show;
		},
		showDialog(value) {
			if (value) {
				return;
			}
			this.$emit('close', value);
		},
	},
	mounted() {
		this.showDialog = this.show;
	},
	methods: {
		hide() {
			this.$emit('close', false);
		},
	},
};
</script>

<style lang="scss">
.add-friends-dialog {
	background: white;
	margin: 2px;
	border-radius: 9.230vw;
}
.close-dialog {
	position: absolute;
	right: 15px;
}
</style>
