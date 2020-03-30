<template>
	<span>
		<v-btn
			ref="add-user-btn"
			icon
			:color="color"
			:small="small"
			:disabled="disabled"
			:class="{ dark }"
			@click="show = true"
		>
			<v-icon :small="true" :color="color">
				sqdi-add-user
			</v-icon>
		</v-btn>
		<AddFriendsDialog ref="add-friends-dialog" :show="show" @close="show = false" />
	</span>
</template>

<script>
import AddFriendsDialog from '~/components/common/AddFriendsDialog';

export default {
	components: {
		AddFriendsDialog,
	},
	props: {
		dark: {
			type: Boolean,
			default: false,
		},
		small: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		color: {
			type: String,
			default: 'black',
		},
	},
	data: () => ({
		show: false,
	}),
};
</script>
<style lang="scss" scoped>
.v-btn {
	border: 2px solid white;
}

.dark {
	background-color: black !important;
}

.profile-add-user .sqdi-add-user  {
	font-size: 6.46vw !important;
}
</style>
